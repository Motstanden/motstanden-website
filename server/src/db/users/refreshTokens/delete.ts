import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function deleteToken(loginToken: string) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM
            login_token
        WHERE 
            token = ?
    `)
    stmt.run(loginToken)
    db.close()
}

export function deleteAllMatches(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM
            login_token
        WHERE user_id = ?
    `)
    stmt.run(userId)
    db.close()
}
