import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deactivateUser(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE user SET
            is_deactivated = 1 
        WHERE
            user_id = @userId
    `)
    stmt.run({ userId: userId })
    db.close()
}

export function activateUser(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE user SET
            is_deactivated = 0 
        WHERE
            user_id = @userId
    `)
    stmt.run({ userId: userId })
    db.close()
}