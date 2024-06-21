import Database from "better-sqlite3"
import { NewSheetArchiveTitle } from "common/interfaces"
import { dbReadWriteConfig, sheetArchiveDB } from "../../config/databaseConfig.js"

export function updateSongTitle(songId: number, song: NewSheetArchiveTitle) {
    const db = new Database(sheetArchiveDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            song_title
        SET
            title = @title,
            extra_info = @extraInfo,
            is_repertoire = @isRepertoire
        WHERE 
            song_title_id = @id`
    )
    stmt.run({
        title: song.title,
        extraInfo: song.extraInfo ?? "",
        isRepertoire: song.isRepertoire ? 1 : 0,
        id: songId
    })
    db.close()
}
