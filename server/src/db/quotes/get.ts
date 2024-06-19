import Database from "better-sqlite3"
import { Quote } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"


export function getQuote(quoteId: number): Quote {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            quote_id as id, 
            utterer, 
            quote,
            created_by as createdBy,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            quote 
        WHERE quote_id = ?
    `)
    const quote = <Quote | undefined>stmt.get(quoteId)
    db.close()

    if (!quote)
        throw "Bad data"

    return quote
}

export function getAll(limit?: number): Quote[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            quote_id as id, 
            utterer, 
            quote,
            created_by as createdBy,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            quote 
        ORDER BY quote_id DESC
        ${!!limit ? "LIMIT ?" : ""}
    `)
    const quotes = !!limit ? stmt.all(limit) : stmt.all()
    db.close()
    return quotes as Quote[]
}
