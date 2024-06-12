import { CommentEntityType, UserGroup } from "common/enums"
import { testUserVariationsCount, unsafeGetUser } from "../../utils/auth.js"
import { APIRequestContext, expect, request, test } from '@playwright/test'
import { Count, NewComment } from "common/interfaces"
import { randomString } from "../../utils/randomString.js"

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

    test("Event comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.Event))
    test("Poll comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.Poll))
    test("Song lyric comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.SongLyric))
    test("Wall post comment increases unread count", async () => testCommentIncreasesCounter(CommentEntityType.WallPost))
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