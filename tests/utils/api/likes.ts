import { APIRequestContext } from "@playwright/test"
import { LikeEntityType } from "common/enums"
import { Like } from "common/interfaces"

async function postLike(api: APIRequestContext, entityType: LikeEntityType, entityId: number) {
    const res = await api.put(`/api/${entityType}/${entityId}/likes/me`, { data: { emojiId: 1 } })
    if (!res.ok()) {
        throw new Error(`Failed to like \`${entityType}\` with \`id\` ${entityId}.\n${res.status()}: ${res.statusText()}\n${await res.text()}`)
    }   
}

async function getAllLikes(api: APIRequestContext, entityType: LikeEntityType, entityId: number) {
    const res = await api.get(`/api/${entityType}/${entityId}/likes`)
    if(!res.ok()) {
        throw new Error(`Failed to get likes for \`${entityType}\` with \`id\` ${entityId}.\n${res.status()}: ${res.statusText()}\n${await res.text()}`)
    }
    const likes = (await res.json()) as Like[]
    return likes
}

export const likesApi = {
    create: postLike,
    getAll: getAllLikes
}