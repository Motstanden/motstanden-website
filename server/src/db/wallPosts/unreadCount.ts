import Database from "better-sqlite3"
import { Count } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function getUnreadCount(userId: number): number | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            count(*) as count
        FROM
            unread_wall_post
        WHERE
            user_id = ?
    `)
    const data = stmt.get(userId) as Count | undefined
    db.close()
    return data?.count
}

export function resetUnreadCount(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            unread_wall_post 
        WHERE user_id = ?
    `)
    stmt.run(userId)
    db.close()
}
