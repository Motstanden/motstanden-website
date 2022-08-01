import express from "express";
import Database from "better-sqlite3";
import { motstandenDB, dbReadOnlyConfig, dbReadWriteConfig } from "../config/databaseConfig.js";
import passport from "passport";
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils.js";

let router = express.Router()

router.get("/quotes", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const db = new Database(motstandenDB, dbReadOnlyConfig)
        const stmt = db.prepare(`
        SELECT 
            quote_id as id, 
            utterer, 
            quote 
        FROM 
            quote 
        ORDER BY quote_id DESC`)
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
            const db = new Database(motstandenDB, dbReadWriteConfig)
            const stmt = db.prepare("INSERT INTO quote(utterer, quote) VALUES (?, ?)")    
            stmt.run(utterer, quote)
            db.close();
        }
        res.end();
    })

    export default router