import Database from "better-sqlite3";
import { NewQuote, Quote } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils";

export function getQuotes(limit?: number): Quote[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        quote_id as id, 
        utterer, 
        quote,
        user_id as userId,
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

    if(stringIsNullOrWhiteSpace(quote.quote) || stringIsNullOrWhiteSpace(quote.utterer) || !userId)
        throw `Invalid data`
    
        const db = new Database(motstandenDB, dbReadWriteConfig)
        const stmt = db.prepare(`
            INSERT INTO 
                quote(utterer, quote, user_id) 
            VALUES (?, ?, ?)
        `)    
        stmt.run(quote.utterer, quote.quote, userId)
        db.close();
}