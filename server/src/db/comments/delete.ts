import Database, { Database as DatabaseType } from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { commentsTable } from "./tableNames.js"

export function deleteComment(entityType: CommentEntityType, commentId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
    DELETE FROM 
        ${commentsTable.name(entityType)}
    WHERE
        ${commentsTable.id(entityType)} = ?
    `)
    stmt.run(commentId)
    db.close()
}

export function deleteAllCommentsByUser(entityType: CommentEntityType, userId: number, existingDbConnection?: DatabaseType) {
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadWriteConfig)
    
    const stmt = db.prepare(`
        DELETE FROM 
            ${commentsTable.name(entityType)}
        WHERE
            created_by = @userId
    `)
    stmt.run({userId: userId})

    if (!existingDbConnection) {
        db.close()
    }
}