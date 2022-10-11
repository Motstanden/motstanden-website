import Database from "better-sqlite3";
import express from "express";
import { dbReadOnlyConfig, sheetArchiveDB } from "../config/databaseConfig.js";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";

let router = express.Router()

router.get("/sheet_archive/song_title",
    AuthenticateUser(),
    (req, res) => {

        const db = new Database(sheetArchiveDB, dbReadOnlyConfig)
        const stmt = db.prepare(`
            SELECT 
                song_title_id as titleId,
                title, 
                extra_info as extraInfo,
                url_title as url,
                is_repertoire as isRepertoire
            FROM 
                song_title 
            ORDER BY title ASC`)
        const sheets = stmt.all()
        res.send(sheets);
        db.close()
    })

router.get("/sheet_archive/song_files",
    AuthenticateUser(),
    (req, res) => {

        const db = new Database(sheetArchiveDB, dbReadOnlyConfig)
        const stmt = db.prepare(`
            SELECT 
                filename as url, 
                clef_name as clef,
                instrument as instrument,
                instrument_voice as instrumentVoice,
                transposition
            FROM 
                vw_song_file 
            WHERE title_id = ?
            ORDER BY instrument ASC`)
        const titleId = req.query.titleId;
        const sheets = stmt.all(titleId)
        res.send(sheets);
        db.close()
    })

export default router;