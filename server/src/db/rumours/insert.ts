import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function insertRumour(userId: number, rumour: string) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            rumour(rumour, created_by) 
        VALUES (@rumour, @createdBy)
    `)
    stmt.run({
        rumour: rumour,
        createdBy: userId,
    })
    db.close()
}
