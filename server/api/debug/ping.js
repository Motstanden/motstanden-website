const router = require("express").Router()
const Database = require('better-sqlite3')
const {dbFilename, dbReadOnlyConfig, dbReadWriteConfig} = require("../../config/databaseConfig")

router.get("/ping", (req, res) => {
    console.log("ping")
    const db = new Database(dbFilename, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT * FROM ping")
    const data = {
        apiResponse: "Pong from the api",
        dbResponse: stmt.get()?.ping ?? "No response from database"
    }
    res.send(data)
    db.close()
})

module.exports = router