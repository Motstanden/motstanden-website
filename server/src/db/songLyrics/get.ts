import Database from "better-sqlite3"
import { SongLyric, StrippedSongLyric } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

interface DbStrippedSongLyric extends Omit<StrippedSongLyric, "isPopular"> {
    isPopular: number
}
export function getSimplifiedList(): StrippedSongLyric[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            song_lyric_id as id,
            is_popular as isPopular,
            title
        FROM song_lyric 
        ORDER BY 
            title
        COLLATE NOCASE ASC;
    `)

    const dbaData = <DbStrippedSongLyric[]>stmt.all()
    db.close()

    const lyrics: StrippedSongLyric[] = dbaData.map(item => ({
        ...item,
        isPopular: item.isPopular === 1
    }))

    return lyrics
}
interface DbSongLyric extends Omit<Required<SongLyric>, "isPopular"> {
    isPopular: number
}

export function get(id: number): Required<SongLyric> | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            song_lyric_id as id,
            title,
            content,
            is_popular as isPopular,

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

    const result = <DbSongLyric | undefined>stmt.get(id)
    db.close()

    return result ? { 
        ...result,
        isPopular: result.isPopular === 1
    } : undefined
}
