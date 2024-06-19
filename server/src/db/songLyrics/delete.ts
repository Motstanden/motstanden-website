import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function deleteLyric(id: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        DELETE FROM 
            song_lyric 
        WHERE 
            song_lyric_id = ?
    `)
    stmt.run(id)
    db.close()
}
