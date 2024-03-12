import Database from "better-sqlite3";
import { NewQuote, Quote } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"
import { isNullOrWhitespace } from "common/utils";

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
    const quote = <Quote | undefined> stmt.get(quoteId)
    db.close()

    if (!quote)
        throw "Bad data"

    return quote
}

export function getQuotes(limit?: number): Quote[] {
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
    ${!!limit ? "LIMIT ?" : ""}`)
    const quotes = !!limit ? stmt.all(limit) : stmt.all()
    db.close()
    return quotes as Quote[]
}

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
    db.close();
}

export function updateQuote(quote: Quote) {

    const isInvalid = isNullOrWhitespace(quote.quote) ||
        isNullOrWhitespace(quote.utterer) ||
        !quote.id || typeof quote.id !== "number"
    if (isInvalid)
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            UPDATE 
                quote
            SET
                utterer = ?,
                quote = ?
            WHERE quote_id = ?`
        )
        stmt.run([quote.utterer, quote.quote, quote.id])
    })
    startTransaction()
    db.close()
}

export function deleteQuote(quoteId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            DELETE FROM 
                quote
            WHERE quote_id = ?;`
        )
        stmt.run(quoteId)
    })
    startTransaction()
    db.close()
}