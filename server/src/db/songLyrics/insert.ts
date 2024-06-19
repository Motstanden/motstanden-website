import Database from "better-sqlite3"
import { NewSongLyric } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function insertLyric(lyric: NewSongLyric, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            song_lyric ( title, content, is_popular, created_by, updated_by ) 
        VALUES 
            (@title, @content, @isPopular, @createdBy, @updatedBy)
    `)
    
    stmt.run({ 
        title: lyric.title,
        content: lyric.content,
        isPopular: lyric.isPopular ? 1 : 0,
        createdBy: userId,
        updatedBy: userId
    })

    db.close()
}
