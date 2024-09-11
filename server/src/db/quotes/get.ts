import Database from "better-sqlite3"
import { Quote } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"
import { AuthoredItem } from "../../ts/interfaces/AuthoredItem.js"


export function getQuoteAuthorInfo(quoteId: number): AuthoredItem | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            quote_id as id, 
            created_by as createdBy
        FROM 
            quote 
        WHERE quote_id = ?
    `)
    const quote = <AuthoredItem | undefined>stmt.get(quoteId)
    db.close()
    return quote
}

type DbQuote = Omit<Quote, "isCreatedByCurrentUser"> & {
    isCreatedByCurrentUser: number
}

export function getAll({
    limit,
    currentUserId,
}: {
    currentUserId: number
    limit?: number,
}): Quote[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            quote_id as id, 
            utterer, 
            quote,
            CASE 
                WHEN created_by = @currentUserId 
                    THEN 1 
                ELSE 0 
            END as isCreatedByCurrentUser,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            quote 
        ORDER BY quote_id DESC
        ${!!limit ? "LIMIT @limit" : ""}
    `)
    const dbResult = stmt.all({
        currentUserId: currentUserId,
        limit: limit
    }) as DbQuote[]
    const quotes = dbResult.map(quote => ({
        ...quote, 
        isCreatedByCurrentUser: quote.isCreatedByCurrentUser === 1
    }))
    db.close()
    return quotes
}
