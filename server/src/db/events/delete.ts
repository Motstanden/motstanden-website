import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"


export function deleteEvent(eventId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            event
        WHERE event_id = ?;`
    )
    stmt.run(eventId)
    db.close()
}
