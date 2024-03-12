import { UserGroup } from "common/enums";
import { NewQuote, Quote } from "common/interfaces";
import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js";
import * as quoteService from "../services/quotes.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";
import dailyRandomInt from "../utils/dailyRandomInt.js";

let router = express.Router()

router.get("/quotes?:limit",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(quoteService.getQuotes(limit))
    }
)

router.get("/quotes/daily-quotes",
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

router.post("/quotes/new",
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
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => quoteService.getQuote(id)
    }),
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
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => quoteService.getQuote(id)
    }),
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

export default router