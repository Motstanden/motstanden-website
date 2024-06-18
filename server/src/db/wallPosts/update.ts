import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function updateContent(postId: number, content: string) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE
            wall_post
        SET
            content = ?
        WHERE
            wall_post_id = ?
    `)
    stmt.run(content, postId)
    db.close()
}
