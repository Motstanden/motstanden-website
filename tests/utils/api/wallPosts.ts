import { APIRequestContext } from "@playwright/test"
import { Count, NewWallPost, WallPost } from "common/interfaces"

async function createPost(request: APIRequestContext, post: NewWallPost) {
    const res = await request.post("/api/wall/posts", { data: post })
    if(!res.ok()){
        throw new Error(`Failed to create post.\n${res.status()}: ${res.statusText()}`)
    }
}

async function deletePost(request: APIRequestContext, postId: number) {
    const res = await request.delete(`/api/wall/posts/${postId}`)
    if(!res.ok()) 
        throw new Error(`Failed to delete post.\n${res.status()}: ${res.statusText()}`)
}

async function getAllPosts(request: APIRequestContext) { 
    const res = await request.get("/api/wall/posts")
    if(!res.ok()) {
        throw new Error(`Failed to get all posts.\n${res.status()}: ${res.statusText()}`)
    }
    const data = await res.json() as WallPost[]
    return data
}

async function getUnreadCount(request: APIRequestContext) {
    const res = await request.get("/api/wall/posts/unread/count")
    const data = await res.json() as Count
    return data.count
}

async function resetUnreadCount(request: APIRequestContext) {
    const res = await request.put("/api/wall/posts/unread/count")
    if(!res.ok()) {
        throw new Error(`Failed to reset unread count.\n${res.status()}: ${res.statusText()}`)
    }
}

export const wallPostsApi = { 
    new: createPost,
    delete: deletePost,
    getAll: getAllPosts,
    
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount
}