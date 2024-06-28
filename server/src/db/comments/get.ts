import Database from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { Comment, EntityComment } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"
import { commentsTable } from "./tableNames.js"

export function getAllUnion(limit?: number): EntityComment[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            event_comment_id as id,
            'event' as type,
            event_id as entityId,
            comment,
            created_by as createdBy,
            created_at as createdAt
        FROM 
            event_comment
        UNION ALL
        SELECT 
            poll_comment_id as id,
            'poll' as type,
            poll_id as entityId,
            comment,
            created_by as createdBy,
            created_at as createdAt
        FROM 
            poll_comment
        UNION ALL
        SELECT 
            song_lyric_comment_id as id,
            'lyrics' as type,
            song_lyric_id as entityId,
            comment,
            created_by as createdBy,
            created_at as createdAt
        FROM 
            song_lyric_comment
        UNION ALL
        SELECT 
            wall_post_comment_id as id,
            'wall-post' as type,
            wall_post_id as entityId,
            comment,
            created_by as createdBy,
            created_at as createdAt
        FROM
            wall_post_comment
        ORDER BY created_at	DESC
        ${!!limit ? "LIMIT ?" : ""};
    `)

    const comments = <EntityComment[]>(!!limit ? stmt.all(limit) : stmt.all())

    db.close()
    return comments
}

export function getAll(entityType: CommentEntityType, entityId: number): Comment[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
    SELECT 
        ${commentsTable.id(entityType)} as id,
        comment,
        created_by as createdBy,
        created_at as createdAt
    FROM
        ${commentsTable.name(entityType)}
    WHERE
        ${commentsTable.entityId(entityType)} = ?
    `)

    const comments = <Comment[]>stmt.all(entityId)
    db.close()
    return comments
}

export function get(entityType: CommentEntityType, commentId: number): Comment | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
    SELECT 
        ${commentsTable.id(entityType)} as id,
        comment,
        created_by as createdBy,
        created_at as createdAt
    FROM
        ${commentsTable.name(entityType)}
    WHERE
        ${commentsTable.id(entityType)} = ?
    `)

    const comment = stmt.get(commentId) as Comment | undefined
    db.close()
    return comment
}
