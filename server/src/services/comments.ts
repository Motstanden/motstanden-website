import Database, { Database as DatabaseType } from "better-sqlite3"
import { CommentEntityType } from "common/enums"
import { Comment, Count, EntityComment, NewComment } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"

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
        ${commentsTable.id(entityType)} as id,
        comment,
        created_by as createdBy,
        created_at as createdAt
    FROM
        ${commentsTable.name(entityType)}
    WHERE
        ${commentsTable.entityId(entityType)} = ?
    `)

    const comments = <Comment[]> stmt.all(entityId)
    db.close()
    return comments
}

function get(entityType: CommentEntityType, commentId: number): Comment | undefined {
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

function insertComment(entityType: CommentEntityType, entityId: number,  comment: NewComment, createdBy: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO ${commentsTable.name(entityType)} (
            ${commentsTable.entityId(entityType)},
            comment,
            created_by) 
        VALUES 
            (?, ?, ?)
        `)
    return stmt.run(entityId, comment.comment, createdBy)
}

function insertUnreadComment(entityType: CommentEntityType, commentId: number | bigint, userId: number, db: DatabaseType) {
    const stmt = db.prepare(`
        INSERT INTO ${unreadCommentsTable.name(entityType)} (
            ${unreadCommentsTable.commentId(entityType)}, 
            user_id)
        VALUES
            (?, ?)
    `)
    return stmt.run(commentId, userId)
}

function insertCommentAndMarkUnread(entityType: CommentEntityType, entityId: number, comment: NewComment, createdBy: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => { 

        // Insert new comment
        const { lastInsertRowid } = insertComment(entityType, entityId, comment, createdBy, db)

        const userIds = getAllUserIds(db)
            .filter(id => id.id !== createdBy)

        // Insert unread comment for all users
        for(const { id } of userIds) { 
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
    const userIds = stmt.all() as { id: number }[]
    return userIds
}


function deleteComment(entityType: CommentEntityType, commentId: number) {
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

function getUnreadCount(userId: number): number | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.Event)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.Poll)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.SongLyric)} WHERE user_id = @userId) +
        (SELECT COUNT(*) FROM ${unreadCommentsTable.name(CommentEntityType.WallPost)} WHERE user_id = @userId) 
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

    db.close()
}

export const commentsService = {
    get: get,
    getAll: getAll,
    getAllUnion: getAllUnion,
    insertNew: insertCommentAndMarkUnread,
    delete: deleteComment,
    getUnreadCount: getUnreadCount,
    resetUnreadCount: resetUnreadCount,
}

// *************************************************************************
//                    Table names for sql query building  
// *************************************************************************

// Comments table names
const commentsTable = {
 
    // *************************************************************************
    // These function exposes the database for sql injection attack.
    // This is dangerous, so don't touch it unless you know what you are doing
    // *************************************************************************
    
    name: (entityType: CommentEntityType): string => {
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
    },

    id: (entityType: CommentEntityType): string => { 
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
    },

    entityId: (entityType: CommentEntityType): string => { 
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
}

// Unread comments table names
const unreadCommentsTable = {
    
    // *************************************************************************
    // These function exposes the database for sql injection attack.
    // This is dangerous, so don't touch it unless you know what you are doing
    // *************************************************************************
    
    name: (entityType: CommentEntityType): string => { 
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
    },

    id: (entityType: CommentEntityType): string => { 
        switch (entityType) {
            case CommentEntityType.Event:
                return "unread_event_comment_id"
            case CommentEntityType.Poll:
                return "unread_poll_comment_id"
            case CommentEntityType.SongLyric:
                return "unread_song_lyric_comment_id"
            case CommentEntityType.WallPost:
                return "unread_wall_post_comment_id"
            default:
                throw `Unknown entity type: ${entityType}`
        }
    },

    commentId: (entityType: CommentEntityType): string => { 
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
    },
}