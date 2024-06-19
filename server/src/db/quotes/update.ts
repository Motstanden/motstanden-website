import Database from "better-sqlite3"
import { Quote } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"


export function updateQuote(quote: Quote) {

    const isInvalid = isNullOrWhitespace(quote.quote) ||
        isNullOrWhitespace(quote.utterer) ||
        !quote.id || typeof quote.id !== "number"
    if (isInvalid)
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            quote
        SET
            utterer = ?,
            quote = ?
        WHERE quote_id = ?`
    )
    stmt.run([quote.utterer, quote.quote, quote.id])
    db.close()
}
