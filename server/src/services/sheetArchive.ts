import Database from "better-sqlite3";
import { SheetArchiveFile, SheetArchiveTitle } from "common/interfaces";
import { isNullOrWhitespace } from "common/utils";
import { dbReadOnlyConfig, dbReadWriteConfig, sheetArchiveDB } from "../config/databaseConfig.js";

interface DbSheetArchiveTitle extends Omit<SheetArchiveTitle, "isPublic" | "isRepertoire"> {
    isPublic: number,
    isRepertoire: number
}

export function getTitles(): SheetArchiveTitle[] {
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
    const dbResult: DbSheetArchiveTitle[] | undefined = stmt.all()
    db.close();

    if(!dbResult)
        throw "Bad data"
        
    const sheets = dbResult.map( item => ({
        ...item, 
        isPublic: item.isPublic === 1, 
        isRepertoire: item.isRepertoire === 1
    })) 
    
    return sheets
}

export function updateTitle(song: SheetArchiveTitle) {
    const isInvalid = isNullOrWhitespace(song.title) ||
                      typeof song.id !== "number" ||
                      typeof song.isRepertoire !== "boolean";
    if(isInvalid)
        throw "Invalid data"

    const db = new Database(sheetArchiveDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            UPDATE 
                song_title
            SET
                title = ?,
                extra_info = ?,
                is_repertoire = ?
            WHERE song_title_id = ?`
        )
        stmt.run([
            song.title, 
            song.extraInfo ?? "", 
            song.isRepertoire ? 1 : 0, 
            song.id
        ])
    })
    startTransaction()
    db.close()
}

export function getFiles(titleId: number): SheetArchiveFile[] {
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
        WHERE title_id = ?
        ORDER BY instrument COLLATE NOCASE ASC`)
    const sheets = stmt.all(titleId)
    db.close()

    if(!sheets)
        throw "Bad data"
    
    return sheets
}