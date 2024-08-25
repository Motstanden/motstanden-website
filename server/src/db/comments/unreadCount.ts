import Database, { Database as DatabaseType } from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { Count } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { unreadCommentsTable } from "./tableNames.js"

export function getUnreadCount(userId: number): number | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.Event)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.Poll)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.SongLyric)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.WallPost)} WHERE user_id = @userId) 
    AS count
    `)
    const data = stmt.get({ userId: userId }) as Count | undefined
    db.close()
    return data?.count
}

export function resetUnreadCount(userId: number, existingDbConnection?: DatabaseType) {

    const db = existingDbConnection ?? new Database(motstandenDB, dbReadWriteConfig)

    const deleteFn = (entityType: CommentEntityType) => {
        const stmt = db.prepare(`
            DELETE FROM 
                ${unreadCommentsTable.name(entityType)} 
            WHERE
                user_id = ?`)
        stmt.run(userId)
    }

    const transaction = db.transaction(() => {
        deleteFn(CommentEntityType.Event)
        deleteFn(CommentEntityType.Poll)
        deleteFn(CommentEntityType.SongLyric)
        deleteFn(CommentEntityType.WallPost)
    })
    transaction()

    if (!existingDbConnection) {
        db.close()
    }
}
