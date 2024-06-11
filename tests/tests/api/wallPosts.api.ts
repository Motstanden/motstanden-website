import { APIRequestContext, expect, request, test } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { Count, NewWallPost, WallPost } from 'common/interfaces'
import { testUserVariationsCount, unsafeGetUser } from '../../utils/auth.js'
import { randomString } from '../../utils/randomString.js'

test.describe.serial("api/wall-posts/unread", () => {
    const user1 = unsafeGetUser(UserGroup.Contributor, testUserVariationsCount - 1)
    const user2 = unsafeGetUser(UserGroup.Administrator, testUserVariationsCount - 1)

    let api1: APIRequestContext
    let api2: APIRequestContext

    let post: WallPost | undefined

    test.beforeEach( async () => {
        api1 = await request.newContext( { storageState: user1.storageStatePath } )
        api2 = await request.newContext( {storageState: user2.storageStatePath })
    })

    test.afterEach( async () => { 
        api1.dispose()
        api2.dispose()
    })

    test("Initial count is 0", async ({ }) => { 
        resetUnreadCount(api1)
        resetUnreadCount(api2)

        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)

        expect(count1).toBe(0)
        expect(count2).toBe(0)
    })
        
    test("New post increases count", async ({ }) => { 
        const newPost: NewWallPost = { 
            wallUserId: user1.id,
            content: randomString("[API tests] Wall post")
        }            
        await createPost(api1, newPost)

        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)
        
        expect(count1).toBe(0)
        expect(count2).toBe(1)

        post = await getMatchingPost(api1, newPost)
    })

    test("Deleting post decreases count", async ({ }) => { 
        await deletePost(api1, post.id)

        const deletedPost = await getMatchingPost(api1, post)
        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)
        
        expect(deletedPost).toBeUndefined()
        expect(count1).toBe(0)
        expect(count2).toBe(0)
    })
})

async function getUnreadCount(request: APIRequestContext) {
    const res = await request.get("/api/wall-posts/unread/count")
    const data = <Count>await res.json()
    return data.count
}

async function resetUnreadCount(request: APIRequestContext) {
    const res = await request.post("/api/wall-posts/unread/count/reset")
    if(!res.ok()) 
        throw new Error("Failed to reset unread count")
}

async function createPost(request: APIRequestContext, post: NewWallPost) {
    const res = await request.post("/api/wall-posts/new", { data: post })
    if(!res.ok()) 
        throw new Error("Failed to create post")
}

async function deletePost(request: APIRequestContext, postId: number) {
    const res = await request.delete(`/api/wall-posts/${postId}`)
    if(!res.ok()) 
        throw new Error("Failed to delete post")
}

async function getAllPosts(request: APIRequestContext) { 
    const res = await request.get("/api/wall-posts/all")
    if(!res.ok()) 
        throw new Error("Failed to get all posts")
    const data = await res.json() as WallPost[]
    return data
}

async function getMatchingPost(request: APIRequestContext, post: NewWallPost): Promise<WallPost | undefined>{
    const allPosts = await getAllPosts(request)
    const matchingPost = allPosts.find(p => p.content === post.content)
    return matchingPost
}
