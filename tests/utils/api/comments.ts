import { APIRequestContext } from '@playwright/test'
import { CommentEntityType } from 'common/enums'
import { Comment, NewComment } from 'common/interfaces'

async function createComment(api: APIRequestContext, entityType: CommentEntityType, entityId: number, comment: string) {
    const data: NewComment = {
        comment: comment
    }
    const res = await api.post(`/api/${entityType}/${entityId}/comments/new`, { data: data })
    if (!res.ok()) {
        throw new Error(`Failed to create ${entityType} comment.\n${await res.text()}`)
    }
}

async function deleteComment(api: APIRequestContext, entityType: CommentEntityType, commentId: number) {
    const res = await api.delete(`/api/${entityType}/comments/${commentId}`)
    if (!res.ok()) {
        throw new Error(`Failed to delete ${entityType} comment ${commentId}.\n${await res.text()}`)
    }
}

async function getAllComments(api: APIRequestContext, entityType: CommentEntityType, entityId: number): Promise<Comment[]> {
    const res = await api.get(`/api/${entityType}/${entityId}/comments`)
    if (!res.ok()) {
        throw new Error(`Failed to get comments for ${entityType} ${entityId}`)
    }
    const data = (await res.json()) as Comment[]
    return data
}

export const commentsApi = {
    new: createComment,
    delete: deleteComment,
    getAll: getAllComments
}