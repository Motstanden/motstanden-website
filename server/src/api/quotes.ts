import express from "express";
import Database from "better-sqlite3";
import { motstandenDB, dbReadOnlyConfig, dbReadWriteConfig } from "../config/databaseConfig.js";
import passport from "passport";
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils.js";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import * as quoteService from "../services/quotes"

let router = express.Router()

router.get("/quotes", 
    AuthenticateUser(),
    (req, res) => res.send(quoteService.getQuotes())
)

router.get("/quotes-of-the-day",
    AuthenticateUser(),
    (req, res) => {
        const limit = 100 
        const quotes = quoteService.getQuotes(limit)
        const i = dailyRandomInt(limit)
        const mod = Math.min(limit, quotes.length)
        res.send([
            quotes[i % mod],
            quotes[(i + 1) % mod],
            quotes[(i + 2) % mod]
        ])
    })

function dailyRandomInt(max: number){
    const date = new Date()
    const unlikelyPrimes = 293391909323 // = 71 * 73 * 79 * 83 * 89 * 97 
    return date.getFullYear() * date.getMonth() * date.getDate() * unlikelyPrimes % max
}

router.post("/insert_quote",    
    AuthenticateUser(),
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