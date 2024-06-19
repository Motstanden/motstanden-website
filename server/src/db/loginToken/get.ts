import Database from "better-sqlite3"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

export function tokenExists(token: string, userId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            1
        FROM 
            login_token
        WHERE 
            user_id = ? AND token = ?
        LIMIT 1
    `)
    const tokenMatch = stmt.get(userId, token)
    db.close()
    return !!tokenMatch
}
