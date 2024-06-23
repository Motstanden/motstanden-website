import Database, { Database as DatabaseType } from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { NewComment } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { commentsTable, unreadCommentsTable } from "./tableNames.js"

function insertComment(entityType: CommentEntityType, entityId: number, comment: NewComment, createdBy: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO ${commentsTable.name(entityType)} (
            ${commentsTable.entityId(entityType)},
            comment,
            created_by) 
        VALUES 
            (@entityId, @comment, @createdBy)
        `)
    return stmt.run({
        entityId,
        comment: comment.comment,
        createdBy
    })
}

function insertUnreadComment(entityType: CommentEntityType, commentId: number | bigint, userId: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO ${unreadCommentsTable.name(entityType)} (
            ${unreadCommentsTable.commentId(entityType)}, 
            user_id)
        VALUES
            (@commentId, @userId)
    `)
    return stmt.run({
        commentId: commentId,
        userId: userId
    })
}

export function insertCommentAndMarkUnread(entityType: CommentEntityType, entityId: number, comment: NewComment, createdBy: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {

        // Insert new comment
        const { lastInsertRowid } = insertComment(entityType, entityId, comment, createdBy, db)

        const userIds = getAllUserIds(db)
            .filter(id => id.id !== createdBy)

        // Insert unread comment for all users
        for (const { id } of userIds) {
            insertUnreadComment(entityType, lastInsertRowid, id, db)
        }
    })
    startTransaction()
    db.close()

}

function getAllUserIds(db: DatabaseType) {
    const stmt = db.prepare(`
        SELECT
            user_id as id
        FROM
            user
    `)
    const userIds = stmt.all() as { id: number} []
    return userIds
}
