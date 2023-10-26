import Database from "better-sqlite3";
import { LikeEntityType } from "common/enums";
import { Like, LikeEmoji, NewLike } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js";

function getTableName(entityType: LikeEntityType): string {
    switch (entityType) {
        case LikeEntityType.EventComment:
            return "event_comment_like"
        case LikeEntityType.PollComment:
            return "poll_comment_like"
        case LikeEntityType.SongLyricComment:
            return "song_lyric_comment_like"
        case LikeEntityType.WallPost:
            return "wall_post_like"
        case LikeEntityType.WallPostComment:
            return "wall_post_comment_like"
    }
}

function getIdColumnName(entitType: LikeEntityType): string {
    switch (entitType) {
        case LikeEntityType.EventComment:
            return "event_comment_like_id"
        case LikeEntityType.PollComment:
            return "poll_comment_like_id"
        case LikeEntityType.SongLyricComment:
            return "song_lyric_comment_like_id"
        case LikeEntityType.WallPost:
            return "wall_post_like_id"
        case LikeEntityType.WallPostComment:
            return "wall_post_comment_like_id"
    }
}

function getEntityIdColumnName(entityType: LikeEntityType): string {
    switch (entityType) {
        case LikeEntityType.EventComment:
            return "event_comment_id"
        case LikeEntityType.PollComment:
            return "poll_comment_id"
        case LikeEntityType.SongLyricComment:
            return "song_lyric_comment_id"
        case LikeEntityType.WallPost:
            return "wall_post_id"
        case LikeEntityType.WallPostComment:
            return "wall_post_comment_id"
    }
}


function getAll(entityType: LikeEntityType, entityId: number): Like[] { 
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT
            ${getIdColumnName(entityType)} as id,
            emoji_id as emojiId,
            user_id as userId
        FROM 
            ${getTableName(entityType)}
        WHERE
            ${getEntityIdColumnName(entityType)} = ?
    `)
    
    const likes: Like[] = stmt.all(entityId)
    db.close()
    return likes
}

function upsert(entityType: LikeEntityType, entityId: number, like: NewLike, userId: number): void {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            INSERT INTO 
                ${getTableName(entityType)} (${getEntityIdColumnName(entityType)}, emoji_id, user_id) 
            VALUES 
                (?, ?, ?)
            ON CONFLICT 
                (${getEntityIdColumnName(entityType)}, user_id) 
            DO UPDATE
                SET emoji_id = EXCLUDED.emoji_id 
        `)
        stmt.run(entityId, like.emojiId, userId)
    })
    startTransaction()
    db.close()
}

function emojiExists(emojiId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            1
        FROM 
            emoji
        WHERE
            emoji_id = ?
    `)
    const exists: 1 | undefined = stmt.get(emojiId)
    db.close()
    return exists === 1
}

function getAllEmojis(): LikeEmoji[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            emoji_id as id,
            name,
            text
        FROM 
            emoji
    `)
    const emojis: LikeEmoji[] = stmt.all()
    db.close()
    return emojis    
}

export const likesService = { 
    getAll: getAll,
    upsert: upsert
}

export const emojiService = {
    exists: emojiExists,
    getAll: getAllEmojis
}