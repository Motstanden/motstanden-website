import { deleteAllLikesByUser, deleteLike } from "./delete.js"
import { emojiExists, getAllEmojis, getAllLikes } from "./get.js"
import { upsert } from "./upsert.js"

export const likesDb = { 
    getAll: getAllLikes,
    upsert: upsert,
    delete: deleteLike,
    deleteAllByUser: deleteAllLikesByUser,

    emojis: {
        exists: emojiExists,
        getAll: getAllEmojis
    }
}