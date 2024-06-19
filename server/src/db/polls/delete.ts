import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deletePoll(pollId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            poll 
        WHERE 
            poll_id = ?
    `)
    stmt.run(pollId)
    db.close()
}
