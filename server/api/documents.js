const router = require("express").Router()
const Database = require('better-sqlite3')
const {dbFilename, dbReadOnlyConfig, dbReadWriteConfig} = require("../config/databaseConfig")
const passport = require("passport")

router.get("/documents", 
    passport.authenticate("jwt", {session: false, failureRedirect: "documents_public"}),
    (req, res) => {
        const db = new Database(dbFilename, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT title, filename AS url FROM document ORDER BY document_id DESC")
        const documents = stmt.all();
        res.send(documents)
        db.close()
    }
)

router.get("/documents_public", (req, res) => {
    const db = new Database(dbFilename, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT \
                                title, \
                                filename AS url \
                            FROM \
                                document \
                            WHERE \
                                is_public=1\
                            ORDER BY \
                                document_id DESC")
    const documents = stmt.all();
    res.send(documents)
    db.close()
})

module.exports = router;