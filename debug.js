const path = require("path")
const Database = require("better-sqlite3")

const DBFILENAME = path.join(__dirname, "motstanden.db")
const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

module.exports = (app, passport) => {
    
    app.get("/api/protected",
        passport.authenticate("jwt", {session: false}),
        (req, res) => {
            res.json({
                username: req.user.username,
                message: "You are logged in as: " + req.user.username
            })
        }
        )

    app.get("/api/ping", (req, res) => {
        console.log("ping")
        const db = new Database(DBFILENAME, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT * FROM ping")
        const data = {
            apiResponse: "Pong from the api",
            dbResponse: stmt.get()?.ping ?? "No response from database"
        }
        res.send(data)
        db.close()
    })
}

