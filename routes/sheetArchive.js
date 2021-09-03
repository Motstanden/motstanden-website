const router = require("express").Router()
const Database = require('better-sqlite3')
const {dbFilename, dbReadOnlyConfig, dbReadWriteConfig} = require("../databaseConfig")
const passport = require("passport")

router.get("/sheet_arcive", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const db = new Database(dbFilename, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT title, url FROM sheet_archive ORDER BY title DESC")
        const sheets = stmt.all()
        res.send(sheets);
        db.close()
})

module.exports = router;