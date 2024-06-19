import Database from "better-sqlite3"
import { isNullOrWhitespace } from "common/utils"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function update(rumourId: number, newRumour: string) {
    const isInvalid = isNullOrWhitespace(newRumour) || !rumourId || typeof rumourId !== "number"
    if (isInvalid)
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            rumour
        SET
            rumour = @rumour
        WHERE 
            rumour_id = @id`
    )
    stmt.run({
        id: rumourId,
        rumour: newRumour,
    })
    db.close()
}
