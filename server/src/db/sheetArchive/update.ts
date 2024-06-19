import Database from "better-sqlite3"
import { SheetArchiveTitle } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadWriteConfig, sheetArchiveDB } from "../../config/databaseConfig.js"

export function updateSongTitle(song: SheetArchiveTitle) {
    const isInvalid = isNullOrWhitespace(song.title) ||
        typeof song.id !== "number" ||
        typeof song.isRepertoire !== "boolean"
    if (isInvalid)
        throw "Invalid data"

    const db = new Database(sheetArchiveDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            song_title
        SET
            title = @title,
            extra_info = @extraInfo,
            is_repertoire = @isRepertoire,
        WHERE 
            song_title_id = @id`
    )
    stmt.run({
        title: song.title,
        extraInfo: song.extraInfo ?? "",
        isRepertoire: song.isRepertoire ? 1 : 0,
        id: song.id
    })
    db.close()
}
