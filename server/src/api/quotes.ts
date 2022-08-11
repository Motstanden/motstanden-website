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
    const currentDate = getCurrentDate();
    const salt = "åæøloxz),m_.!#?¤bxvuesaJM"
    const salt2 = "Ωvs&<>/*-TC^'$€%I`~"
    const hashedDate = hashCode(salt2 + currentDate + salt)
    return Math.abs(hashedDate) % max
}

function getCurrentDate(): string {
    return new Date()
        .toLocaleString("no-no", { timeZone: "cet"})
        .split(",")[0]
}

// Generates a fast non-secure simple hash
// https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
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