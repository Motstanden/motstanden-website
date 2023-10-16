import Database from "better-sqlite3"
import { NewSongLyric, SongLyric, StrippedSongLyric } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"

interface DbStrippedSongLyric extends Omit<StrippedSongLyric, "isPopular"> {
    isPopular: number
}

function getSimpleList(): StrippedSongLyric[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT
            song_lyric_id as id,
            is_popular as isPopular,
            title
        FROM song_lyric 
        ORDER BY 
            title
    `) 

    const dbaData: DbStrippedSongLyric[] = stmt.all()
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

function get(id: number): Required<SongLyric> {
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

    const dbData: DbSongLyric | undefined = stmt.get(id)
    db.close()

    if(!dbData)
        throw "Song lyric not found"

    const lyric = {
        ...dbData, 
        isPopular: dbData.isPopular === 1
    }

    return lyric
}

function insertNew(lyric: NewSongLyric, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            song_lyric ( title, content, is_popular, created_by, updated_by ) 
        VALUES 
            (?, ?, ?, ?, ?)
    `) 

    stmt.run(
        lyric.title, 
        lyric.content, 
        lyric.isPopular ? 1 : 0, 
        userId, 
        userId
    )
    db.close()
}

function deleteLyric(id: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            DELETE FROM 
                song_lyric 
            WHERE 
                song_lyric_id = ?
        `) 
        stmt.run(id)
    })
    startTransaction()
    db.close()
}

export const songLyricService = {
    getSimpleList: getSimpleList,
    get: get,
    insertNew: insertNew,
    delete: deleteLyric
}