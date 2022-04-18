const router = require("express").Router()
const Database = require('better-sqlite3')
const {sheetArchiveDB, dbReadOnlyConfig, dbReadWriteConfig} = require("../config/databaseConfig")
const passport = require("passport")

router.get("/sheet_archive", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {

        throw "NotImplementedException: TODO, fix this"

        const db = new Database(sheetArchiveDB, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT title, url FROM sheet_archive ORDER BY title DESC")
        const sheets = stmt.all()
        res.send(sheets);
        db.close()
})

module.exports = router;