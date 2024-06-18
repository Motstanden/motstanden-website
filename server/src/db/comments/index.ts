import { deleteComment } from "./delete.js"
import { get, getAll, getAllUnion } from "./get.js"
import { insertCommentAndMarkUnread } from "./insert.js"
import { getUnreadCount, resetUnreadCount } from "./unreadCount.js"
import { updateComment } from "./update.js"

export const commentsDb = {
    get: get,
    getAll: getAll,
    getAllUnion: getAllUnion,
    insertNew: insertCommentAndMarkUnread,
    delete: deleteComment,
    update: updateComment,
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount,
}