import Database from "better-sqlite3"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

export function tokenExists(token: string, userId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            token
        FROM 
            login_token
        WHERE 
            user_id = ?
        `
    )
    const tokens = <{ token: string} []>stmt.all(userId)
    db.close()
    const tokenMatch = tokens.find(item => item.token === token)
    return !!tokenMatch
}
