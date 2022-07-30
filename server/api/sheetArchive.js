const router = require("express").Router()
const Database = require('better-sqlite3')
const {sheetArchiveDB, dbReadOnlyConfig, dbReadWriteConfig} = require("../config/databaseConfig")
const passport = require("passport")

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

module.exports = router;