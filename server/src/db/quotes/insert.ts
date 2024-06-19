import Database from "better-sqlite3"
import { NewQuote } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"


export function insertQuote(quote: NewQuote, userId: number) {

    if (isNullOrWhitespace(quote.quote) || isNullOrWhitespace(quote.utterer) || !userId)
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            quote(utterer, quote, created_by) 
        VALUES (?, ?, ?)
    `)
    stmt.run(quote.utterer, quote.quote, userId)
    db.close()
}
