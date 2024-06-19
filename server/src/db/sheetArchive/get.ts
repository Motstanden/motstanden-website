import Database from "better-sqlite3"
import { SheetArchiveFile, SheetArchiveTitle } from "common/interfaces"
import { dbReadOnlyConfig, sheetArchiveDB } from "../../config/databaseConfig.js"

interface DbSheetArchiveTitle extends Omit<SheetArchiveTitle, "isPublic" | "isRepertoire"> {
    isPublic: number
    isRepertoire: number
}

export function getSongTitles(): SheetArchiveTitle[] {
    const db = new Database(sheetArchiveDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            song_title_id as id,
            title, 
            extra_info as extraInfo,
            is_repertoire as isRepertoire,
            is_public as isPublic,
            url_title as url
        FROM 
            song_title 
        ORDER BY title COLLATE NOCASE ASC`)
    const dbResult = <DbSheetArchiveTitle[]>stmt.all()
    db.close()

    const sheets = dbResult.map(item => ({
        ...item,
        isPublic: item.isPublic === 1,
        isRepertoire: item.isRepertoire === 1
    }))

    return sheets
}

export function getSongFiles(titleId: number): SheetArchiveFile[] {
    const db = new Database(sheetArchiveDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            song_file_id as id,
            filename as url, 
            clef_name as clef,
            instrument,
            instrument_voice as instrumentVoice,
            transposition
        FROM 
            vw_song_file 
        WHERE 
            title_id = ?
        ORDER BY instrument COLLATE NOCASE ASC`)
    const sheets = <SheetArchiveFile[]>stmt.all(titleId)
    db.close()
    return sheets
}
