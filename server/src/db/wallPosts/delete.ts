import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deletePost(postId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            wall_post
        WHERE
            wall_post_id = ?
    `)
    stmt.run(postId)
    db.close()
}
