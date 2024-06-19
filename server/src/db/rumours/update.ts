import Database from "better-sqlite3"
import { Rumour } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function update(newRumour: Rumour) {
    const isInvalid = isNullOrWhitespace(newRumour.rumour) || !newRumour.id || typeof newRumour.id !== "number"
    if (isInvalid)
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            rumour
        SET
            rumour = ?
        WHERE rumour_id = ?`
    )
    stmt.run([newRumour.rumour, newRumour.id])
    db.close()
}
