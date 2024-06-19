import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deleteRumour(rumourId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            rumour
        WHERE rumour_id = ?;`
    )
    stmt.run(rumourId)
    db.close()
}
