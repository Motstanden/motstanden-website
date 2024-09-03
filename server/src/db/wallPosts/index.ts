import { deleteAllPostsByUser, deleteAllPostsOnWall, deletePost } from "./delete.js"
import { get, getAll } from "./get.js"
import { insertPostAndMarkUnread } from "./insert.js"
import { getUnreadCount, resetUnreadCount } from "./unreadCount.js"
import { updateContent } from "./update.js"

export const wallPostsDb = { 
    get: get,
    getAll: getAll,
    insertPostAndMarkUnread: insertPostAndMarkUnread,
    updateContent: updateContent,
    delete: deletePost,
    deleteAllByUser: deleteAllPostsByUser,
    deleteAllOnWall: deleteAllPostsOnWall,
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount,
}