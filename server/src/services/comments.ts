import Database from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js"

function getAll(entityType: CommentEntityType, entityId: number): Comment[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
    SELECT 
        ${getIdColumnName(entityType)} as id,
        comment,
        created_by as createdBy
    FROM
        ${getTableName(entityType)}
    WHERE
        ${getEntityIdColumnName(entityType)} = ?
    `)

    const comments: Comment[] = stmt.all(entityId)
    db.close()
    return comments
}

// This function exposes the database for sql injection attack.
// This is dangerous, so don't touch it unless you know what you are doing
function getTableName(entityType: CommentEntityType): string {
    switch (entityType) {
        case CommentEntityType.Event:
            return "event_comment"
        case CommentEntityType.Poll:
            return "poll_comment"
        default:
            throw `Unknown entity type: ${entityType}`
    }
}

// This function exposes the database for sql injection attack.
// This is dangerous, so don't touch it unless you know what you are doing
function getIdColumnName(entityType: CommentEntityType): string {
    switch (entityType) {
        case CommentEntityType.Event:
            return "event_comment_id"
        case CommentEntityType.Poll:
            return "poll_comment_id"
        default:
            throw `Unknown entity type: ${entityType}`
    }
}

// This function exposes the database for sql injection attack.
// This is dangerous, so don't touch it unless you know what you are doing
function getEntityIdColumnName(entityType: CommentEntityType): string {
    switch (entityType) {
        case CommentEntityType.Event:
            return "event_id"
        case CommentEntityType.Poll:
            return "poll_id"
        default:
            throw `Unknown entity type: ${entityType}`
    }
}


export const commentsService = {
    getAll: getAll
}