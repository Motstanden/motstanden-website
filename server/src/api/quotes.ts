import express, { NextFunction, Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import * as quoteService from "../services/quotes"
import { NewQuote, Quote } from "common/interfaces";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";
import { hasGroupAccess } from "../utils/accessTokenUtils";
import { UserGroup } from "common/enums";

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
        const user = req.user as AccessTokenData
        try {
            quoteService.insertQuote(req.body as NewQuote, user.userId)
        }
        catch {
            res.status(400).send("Bad data")  
        }
        res.end();
    }
)

router.post("/quotes/delete", 
    AuthenticateUser(),
    authenticatePermission,
    (req: Request, res: Response) => {
        const quoteId: number = req.body.id
        try {
            quoteService.deleteQuote(quoteId)
        } catch {
            res.status(400).send("Bad data")
        }
        res.end();
    }
)

router.post("/quotes/update", 
    AuthenticateUser(),
    authenticatePermission,
    (req: Request, res: Response) => {
        const quote: Quote = req.body
        try {
            quoteService.updateQuote(quote)
        } catch {
            return res.status(400).send("bad data")
        }
        res.end();
    }
)

// Check if:
//  1. Quote exists.
//  2. The user is admin or is the author of the quote
function authenticatePermission(req: Request, res: Response, next: NextFunction) {
    
    // Check if the posted quoteId is valid
    let quoteId: number | unknown = req.body.id
    if(!quoteId || typeof quoteId !== "number"){
        return res.status(400).send("Bad data")
    }
    let quote
    try {
        quote = quoteService.getQuote(quoteId) 
    } catch {
        return res.status(400).send("bad data")
    }
    
    // Allow quote to be modified if the user is admin or is original author
    const user = req.user as AccessTokenData
    const isAdmin = hasGroupAccess(user, UserGroup.Administrator)
    const isEventAuthor = quote.createdBy === user.userId
    if(isAdmin || isEventAuthor) {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}

export default router