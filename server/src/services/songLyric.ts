import Database from "better-sqlite3"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
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

function get(id: number): SongLyric {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            song_lyric_id as id,
            title,
            content
        FROM 
            song_lyric 
        WHERE 
            song_lyric_id = ?
    `) 

    const lyric: SongLyric | undefined = stmt.get(id)
    db.close()

    if(!lyric)
        throw "Song lyric not found"

    return lyric
}

export const songLyricService = {
    getSimpleList: getSimpleList,
    get: get,
}