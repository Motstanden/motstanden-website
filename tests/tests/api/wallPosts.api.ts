import { APIRequestContext, expect, request, test } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { Count, NewWallPost, WallPost } from 'common/interfaces'
import { testUserVariationsCount, unsafeGetUser } from '../../utils/auth.js'
import { randomString } from '../../utils/randomString.js'

// WARNING:
// These tests may fail if they are run in parallel with e2e/wallPosts.spec.ts or themselves
// The tests share the same database, and the tests in e2e/wallPosts.spec.ts 
// will modify the unread wall posts counter.
//
// TODO:
// Create a global thread-safe lock to prevent parallel execution between the two test files
//

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
        await resetUnreadCount(api1)
        await resetUnreadCount(api2)

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
        expect(post).toBeDefined()
    })

    test("Deleting post decreases count", async ({ }) => { 
        await deletePost(api1, post!.id)

        const deletedPost = await getMatchingPost(api1, post!)
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
    const res = await request.put("/api/wall-posts/unread/count")
    if(!res.ok()) 
        throw new Error(`Failed to reset unread count.\n${res.status()}: ${res.statusText()}`)
}

async function createPost(request: APIRequestContext, post: NewWallPost) {
    const res = await request.post("/api/wall-posts", { data: post })
    console.log(res)
    if(!res.ok()) 
        throw new Error(`Failed to create post.\n${res.status()}: ${res.statusText()}`)
}

async function deletePost(request: APIRequestContext, postId: number) {
    const res = await request.delete(`/api/wall-posts/${postId}`)
    if(!res.ok()) 
        throw new Error(`Failed to delete post.\n${res.status()}: ${res.statusText()}`)
}

async function getAllPosts(request: APIRequestContext) { 
    const res = await request.get("/api/wall-posts")
    if(!res.ok()) 
        throw new Error(`Failed to get all posts.\n${res.status()}: ${res.statusText()}`)
    const data = await res.json() as WallPost[]
    return data
}

async function getMatchingPost(request: APIRequestContext, post: NewWallPost): Promise<WallPost | undefined>{
    const allPosts = await getAllPosts(request)
    const matchingPost = allPosts.find(p => p.content === post.content)
    return matchingPost
}
