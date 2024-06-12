import Database from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { Comment, Count, EntityComment, NewComment } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"

// This function exposes the database for sql injection attack.
// This is dangerous, so don't touch it unless you know what you are doing
function getTableName(entityType: CommentEntityType): string {
    switch (entityType) {
        case CommentEntityType.Event:
            return "event_comment"
        case CommentEntityType.Poll:
            return "poll_comment"
        case CommentEntityType.SongLyric:
            return "song_lyric_comment"
        case CommentEntityType.WallPost:
            return "wall_post_comment"
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
        case CommentEntityType.SongLyric:
            return "song_lyric_comment_id"
        case CommentEntityType.WallPost:
            return "wall_post_comment_id"
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
        case CommentEntityType.SongLyric:
            return "song_lyric_id"
        case CommentEntityType.WallPost:
            return "wall_post_id"
        default:
            throw `Unknown entity type: ${entityType}`
    }
}

function getUnreadCommentTableName(entityType: CommentEntityType): string { 
    switch (entityType) {
        case CommentEntityType.Event:
            return "unread_event_comment"
        case CommentEntityType.Poll:
            return "unread_poll_comment"
        case CommentEntityType.SongLyric:
            return "unread_song_lyric_comment"
        case CommentEntityType.WallPost:
            return "unread_wall_post_comment"
        default:
            throw `Unknown entity type: ${entityType}`
    }
}

function getAllUnion(limit?: number): EntityComment[]{
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
            'song-lyric' as type,
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

    const comments = <EntityComment[]> ( !!limit ? stmt.all(limit) : stmt.all() )

    db.close()
    return comments   
}

function getAll(entityType: CommentEntityType, entityId: number): Comment[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
    SELECT 
        ${getIdColumnName(entityType)} as id,
        comment,
        created_by as createdBy,
        created_at as createdAt
    FROM
        ${getTableName(entityType)}
    WHERE
        ${getEntityIdColumnName(entityType)} = ?
    `)

    const comments = <Comment[]> stmt.all(entityId)
    db.close()
    return comments
}

function get(entityType: CommentEntityType, commentId: number): Comment | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
    SELECT 
        ${getIdColumnName(entityType)} as id,
        comment,
        created_by as createdBy,
        created_at as createdAt
    FROM
        ${getTableName(entityType)}
    WHERE
        ${getIdColumnName(entityType)} = ?
    `)

    const comment = stmt.get(commentId) as Comment | undefined
    db.close()
    return comment
}

function insertNew(entityType: CommentEntityType, entityId: number,  comment: NewComment, createdBy: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const stmt = db.prepare(`
    INSERT INTO ${getTableName(entityType)} (
        ${getEntityIdColumnName(entityType)},
        comment,
        created_by) 
    VALUES 
        (?, ?, ?)
    `)
    stmt.run(entityId, comment.comment, createdBy)
    db.close()
}

function deleteComment(entityType: CommentEntityType, commentId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
    DELETE FROM 
        ${getTableName(entityType)}
    WHERE
        ${getIdColumnName(entityType)} = ?
    `)
    stmt.run(commentId)
    db.close()
}

function getUnreadCount(userId: number): number | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        (SELECT COUNT(*) FROM ${getUnreadCommentTableName(CommentEntityType.Event)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${getUnreadCommentTableName(CommentEntityType.Poll)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${getUnreadCommentTableName(CommentEntityType.SongLyric)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${getUnreadCommentTableName(CommentEntityType.WallPost)} WHERE user_id = @userId) 
    AS count
    `)
    const data = stmt.get({userId: userId}) as Count | undefined
    db.close()
    return data?.count
}

function resetUnreadCount(userId: number) {
    
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const deleteFn = (entityType: CommentEntityType) => { 
        const stmt = db.prepare(`
            DELETE FROM 
                ${getUnreadCommentTableName(entityType)} 
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

    db.close()
}

export const commentsService = {
    get: get,
    getAll: getAll,
    getAllUnion: getAllUnion,
    insertNew: insertNew,
    delete: deleteComment,
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount,
}