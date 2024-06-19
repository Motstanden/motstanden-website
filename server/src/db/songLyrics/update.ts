import Database from "better-sqlite3"
import { NewSongLyric } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function update(lyric: NewSongLyric, id: number, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            song_lyric 
        SET 
            title = @title,
            content = @content,
            is_popular = @isPopular,
            updated_by = @updatedBy
        WHERE 
            song_lyric_id = @id
    `)
    stmt.run({
        title: lyric.title,
        content: lyric.content,
        isPopular: lyric.isPopular ? 1 : 0,
        updatedBy: userId,
        id: id
    })
    db.close()
}
