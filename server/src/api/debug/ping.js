import express from "express";
import Database from "better-sqlite3";
import { motstandenDB, dbReadOnlyConfig, dbReadWriteConfig } from "../../config/databaseConfig.js";

let router = express.Router()

router.get("/ping", (req, res) => {
    console.log("ping")
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT * FROM ping")
    const data = {
        apiResponse: "Pong from the api",
        dbResponse: stmt.get()?.ping ?? "No response from database"
    }
    res.send(data)
    db.close()
})

export default router