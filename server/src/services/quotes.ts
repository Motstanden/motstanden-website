import Database from "better-sqlite3";
import { Quote } from "common/interfaces";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig";

export function getQuotes(limit?: number): Quote[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        quote_id as id, 
        utterer, 
        quote 
    FROM 
        quote 
    ORDER BY quote_id DESC
    ${!!limit ? "LIMIT ?" : ""}`)
    const quotes = !!limit ? stmt.all(limit) : stmt.all()
    db.close()
    return quotes as Quote[]
}