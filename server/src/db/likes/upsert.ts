import Database from "better-sqlite3"
import { LikeEntityType } from "common/enums"
import { NewLike } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { likesTable } from "./tableNames.js"

export function upsert(entityType: LikeEntityType, entityId: number, like: NewLike, userId: number): void {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            ${likesTable.name(entityType)} (${likesTable.entityId(entityType)}, emoji_id, user_id) 
        VALUES 
            (?, ?, ?)
        ON CONFLICT 
            (${likesTable.entityId(entityType)}, user_id) 
        DO UPDATE
            SET emoji_id = EXCLUDED.emoji_id 
    `)
    stmt.run(entityId, like.emojiId, userId)
    db.close()
}
