import express from "express";
import Database from "better-sqlite3";
import { sheetArchiveDB, dbReadOnlyConfig, dbReadWriteConfig } from "../config/databaseConfig.js";
import passport from "passport";

let router = express.Router()

router.get("/sheet_archive/song_title", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {

        const db = new Database(sheetArchiveDB, dbReadOnlyConfig)
        const stmt = db.prepare(`
            SELECT 
                song_title_id as titleId,
                title, 
                extra_info as extraInfo,
                url_title as url
            FROM 
                song_title 
            ORDER BY title ASC`)
        const sheets = stmt.all()
        res.send(sheets);
        db.close()
})

router.get("/sheet_archive/song_files", 
    passport.authenticate("jwt", {session: false}),
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