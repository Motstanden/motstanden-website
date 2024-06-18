import Database from "better-sqlite3"
import { SimpleText } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

export function get(key: string): SimpleText | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            simple_text_id as id,
            key,
            text,
            updated_by as updatedBy,
            updated_at as updatedAt
        FROM 
            simple_text 
        WHERE 
            key = ?
    `)
    const data = <SimpleText | undefined>stmt.get(key)
    db.close()
    return data
}
