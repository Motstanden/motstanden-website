import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deleteQuote(quoteId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            quote
        WHERE quote_id = ?;`
    )
    stmt.run(quoteId)
    db.close()
}
