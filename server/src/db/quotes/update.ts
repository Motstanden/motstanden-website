import Database from "better-sqlite3"
import { NewQuote } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"


export function updateQuote(quoteId: number, quote: NewQuote) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            quote
        SET
            utterer = @utterer,
            quote = @quote
        WHERE quote_id = @id`
    )
    stmt.run({
        utterer: quote.utterer,
        quote: quote.quote,
        id: quoteId
    })
    db.close()
}
