import { APIRequestContext, expect, request, test } from '@playwright/test'
import { CommentEntityType, UserGroup } from "common/enums"
import { Comment, Count, NewComment } from "common/interfaces"
import { testUserVariationsCount, unsafeGetUser } from "../../utils/auth.js"
import { randomString } from "../../utils/randomString.js"

// WARNING:
// These tests may fail if they are run in parallel with e2e/comments.spec.ts
// The tests share the same database, and the tests in e2e/wallPosts.spec.ts 
// will modify the unread wall posts counter.
//
// TODO:
// Create a global thread-safe lock to prevent parallel execution between the two test files
//

test.describe.serial("Comments test suite", () => {
    const user1 = unsafeGetUser(UserGroup.Contributor, testUserVariationsCount - 1)
    const user2 = unsafeGetUser(UserGroup.Administrator, testUserVariationsCount - 1)
    
    let api1: APIRequestContext
    let api2: APIRequestContext

    let unreadComments: { 
        entityId: number,
        entityType: CommentEntityType,
        comment: string
    }[] = []
    let unreadCount = 0

    test.beforeEach( async () => {
        api1 = await request.newContext( { storageState: user1.storageStatePath } )
        api2 = await request.newContext( {storageState: user2.storageStatePath })
    })

    test.afterEach( async () => { 
        api1.dispose()
        api2.dispose()
    })

    test("Initial unread comments count is 0", async () => {
        await resetUnreadCount(api1)
        await resetUnreadCount(api2)

        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)

        expect(count1).toBe(0)
        expect(count2).toBe(0)
    })

    const testCommentIncreasesCounter = async (entityType: CommentEntityType) => {
        const entityId = 1
        const comment = randomString(`Comment on ${entityType} ${entityId}`)

        await createComment(api1, entityType, entityId, comment)

        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)

        expect(count1).toBe(0)
        expect(count2).toBe(unreadCount + 1)

        unreadComments.push({entityId, entityType, comment})
        unreadCount++
    }

    const testDeleteCommentDecreasesCounter = async (entityType: CommentEntityType) => { 
        const postedComment = unreadComments.find(c => c.entityType === entityType)
        if(!postedComment) {
            throw new Error(`No unread comments for ${entityType}`)
        }

        const actualComment = await getMatchingComment(api1, entityType, postedComment.entityId, postedComment.comment)
        if(!actualComment) {
            throw new Error(`Comment not found for ${entityType} ${postedComment.entityId}`)
        }
        expect(actualComment).toBeDefined()

        await deleteComment(api1, entityType, actualComment.id)

        const deletedComment = await getMatchingComment(api1, entityType, postedComment.entityId, postedComment.comment)
        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)

        expect(deletedComment).toBeUndefined()
        expect(count1).toBe(0)
        expect(count2).toBe(unreadCount - 1)

        unreadComments = unreadComments.filter(c => c !== postedComment)
        unreadCount--
    }

    test("POST Event comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.Event))
    test("POST Poll comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.Poll))
    test("POST Song lyric comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.SongLyric))
    test("POST Wall post comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.WallPost))

    test("DELETE event comment decreases unread count", async () => testDeleteCommentDecreasesCounter(CommentEntityType.Event))
    test("DELETE poll comment decreases unread count", async () => testDeleteCommentDecreasesCounter(CommentEntityType.Poll))
    test("DELETE song lyric comment decreases unread count", async () => testDeleteCommentDecreasesCounter(CommentEntityType.SongLyric))
    test("DELETE wall post comment decreases unread count", async () => testDeleteCommentDecreasesCounter(CommentEntityType.WallPost))
})

async function getUnreadCount(api:APIRequestContext) {
    const res = await api.get("/api/comments/unread/count")
    if(!res.ok())
        throw new Error("Failed to get unread count")
    const data = await res.json() as Count
    return data.count
}

async function resetUnreadCount(api: APIRequestContext) { 
    const res = await api.post("/api/comments/unread/count/reset")
    if(!res.ok())
        throw new Error("Failed to reset unread count")
}

async function createComment(api: APIRequestContext, entityType: CommentEntityType, entityId: number, comment: string, ) { 
    const data: NewComment = { 
        comment: comment 
    }
    const res = await api.post(`/api/${entityType}/${entityId}/comments/new`, {data: data})
    if(!res.ok()) {
        throw new Error(`Failed to create ${entityType} comment.\n${await res.text()}`)
    }
}

async function deleteComment(api: APIRequestContext, entityType: CommentEntityType, commentId: number) { 
    const res = await api.delete(`/api/${entityType}/comments/${commentId}`)
    if(!res.ok()) {
        throw new Error(`Failed to delete ${entityType} comment ${commentId}.\n${await res.text()}`)
    }
}

async function getAllComments(api: APIRequestContext, entityType: CommentEntityType, entityId: number): Promise<Comment[]> {
    const res = await api.get(`/api/${entityType}/${entityId}/comments`)
    if(!res.ok()) {
        throw new Error(`Failed to get comments for ${entityType} ${entityId}`)
    }
    const data = (await res.json()) as Comment[]
    return data
}

async function getMatchingComment(api: APIRequestContext, entityType: CommentEntityType, entityId: number, comment: string): Promise<Comment | undefined>{
    const comments = await getAllComments(api, entityType, entityId)
    const matchingComment = comments.find(c => c.comment === comment)
    return matchingComment
}