import Database from "better-sqlite3"
import { LikeEntityType } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { likesTable } from "./tableNames.js"

export function deleteLike(entityType: LikeEntityType, entityId: number, userId: number): void {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            DELETE FROM 
                ${likesTable.name(entityType)}
            WHERE
                ${likesTable.entityId(entityType)} = ?
            AND
                user_id = ?
        `)
        stmt.run(entityId, userId)
    })
    startTransaction()
    db.close()
}
