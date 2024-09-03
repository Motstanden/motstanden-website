import Database, { Database as DatabaseType } from "better-sqlite3"
import { LikeEntityType } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { likesTable } from "./tableNames.js"

export function deleteLike(entityType: LikeEntityType, entityId: number, userId: number): void {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            ${likesTable.name(entityType)}
        WHERE
            ${likesTable.entityId(entityType)} = @entityId
        AND
            user_id = @userId
    `)
    stmt.run({
        entityId: entityId,
        userId: userId
    })
    db.close()
}

export function deleteAllLikesByUser(entityType: LikeEntityType, userId: number, existingDbConnection?: DatabaseType): void { 
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadWriteConfig)
    
    const stmt = db.prepare(`
        DELETE FROM 
            ${likesTable.name(entityType)}
        WHERE
            user_id = @userId
    `)
    stmt.run({userId: userId})

    if (!existingDbConnection) {
        db.close()
    }
}