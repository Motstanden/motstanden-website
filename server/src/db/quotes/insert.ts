import Database from "better-sqlite3"
import { NewQuote } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function insertQuote(userId: number, quote: NewQuote) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            quote(utterer, quote, created_by) 
        VALUES (@utterer, @quote, @createdBy)
    `)
    stmt.run({
        utterer: quote.utterer,
        quote: quote.quote,
        createdBy: userId
    })
    db.close()
}
