import Database from "better-sqlite3"
import { LikeEntityType } from "common/enums"
import { Like, LikeEmoji } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"
import { likesTable } from "./tableNames.js"

export function getAllLikes(entityType: LikeEntityType, entityId: number): Like[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    // Get all likes and order them by the most used emoji
    const stmt = db.prepare(`
        SELECT
            ${likesTable.id(entityType)} as id,
            emoji_id as emojiId,
            user_id as userId
        FROM 
            ${likesTable.name(entityType)} as parent
        WHERE
            ${likesTable.entityId(entityType)} = ?
        ORDER BY 
            emoji_id ASC
    `)

    const likes = <Like[]>stmt.all(entityId)
    db.close()
    return likes
}

export function getAllEmojis(): LikeEmoji[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            emoji_id as id,
            description,
            text
        FROM 
            emoji
    `)
    const emojis = <LikeEmoji[]>stmt.all()
    db.close()
    return emojis
}

export function emojiExists(emojiId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            1 as value
        FROM 
            emoji
        WHERE
            emoji_id = ?
    `)
    const data = <{ value: number}  | undefined>stmt.get(emojiId)
    db.close()
    return data?.value === 1
}