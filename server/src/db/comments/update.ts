import Database from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { commentsTable } from "./tableNames.js"

export function updateComment(entityType: CommentEntityType, commentId: number, comment: string) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            ${commentsTable.name(entityType)}
        SET
            comment = ?
        WHERE
            ${commentsTable.id(entityType)} = ?
    `)
    stmt.run(comment, commentId)
    db.close()
}
