const router = require("express").Router()
const Database = require('better-sqlite3')
const {dbFilename, dbReadOnlyConfig, dbReadWriteConfig} = require("../databaseConfig")
const passport = require("passport")
const { stringIsNullOrWhiteSpace } = require("../utils/stringUtils")

router.get("/quotes", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const db = new Database(dbFilename, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT utterer, quote FROM quote ORDER BY quote_id DESC")
        const quotes = stmt.all();
        res.send(quotes);
        db.close();
})

router.post("/insert_quote",    
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const utterer = req.body.utterer
        const quote = req.body.quote
        if (stringIsNullOrWhiteSpace(utterer) || stringIsNullOrWhiteSpace(quote)) {
            res.status(400).send("The server could not parse the payload.")
        } else {
            const db = new Database(dbFilename, dbReadWriteConfig)
            const stmt = db.prepare("INSERT INTO quote(utterer, quote) VALUES (?, ?)")    
            stmt.run(utterer, quote)
            db.close();
        }
        res.end();
    })


module.exports = router