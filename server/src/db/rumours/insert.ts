import Database from "better-sqlite3"
import { NewRumour } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function insertRumour(rumour: NewRumour, userId: number) {

    if (isNullOrWhitespace(rumour.rumour) || (typeof userId !== "number" && userId < 0))
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            rumour(rumour, created_by) 
        VALUES (?, ?)
    `)
    stmt.run(rumour.rumour, userId)
    db.close()
}
