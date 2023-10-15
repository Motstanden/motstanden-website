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

interface DbSongLyric extends Required<SongLyric> {}

function get(id: number): DbSongLyric {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            song_lyric_id as id,
            title,
            content,

            created_by_user_id as createdBy,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedBy,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt
        FROM 
            vw_song_lyric 
        WHERE 
            song_lyric_id = ?
    `) 

    const lyric: DbSongLyric | undefined = stmt.get(id)
    db.close()

    if(!lyric)
        throw "Song lyric not found"

    return lyric
}

export const songLyricService = {
    getSimpleList: getSimpleList,
    get: get,
}