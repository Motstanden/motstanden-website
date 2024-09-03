import Database, { Database as DatabaseType } from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function deleteAllParticipationByUser(userId: number, existingDbConnection?: DatabaseType) {
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadWriteConfig)
    
    const stmt = db.prepare(`
        DELETE FROM 
            event_participant
        WHERE
            user_id = @userId
    `)
    stmt.run({userId: userId})

    if (!existingDbConnection) {
        db.close()
    }
}