import Database from "better-sqlite3"
import { StrippedSongLyric } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js"

function getSimpleList(): StrippedSongLyric[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            song_lyric_id as id,
            title
        FROM song_lyric 
        ORDER BY 
            title
    `) 

    const lyrics: StrippedSongLyric[] = stmt.all()
    db.close()

    return lyrics
}

export const songLyricService = {
    getList: getSimpleList
}