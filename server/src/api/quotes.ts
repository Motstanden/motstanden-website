import { UserGroup } from "common/enums"
import { NewQuote, Quote } from "common/interfaces"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import dailyRandomInt from "../utils/dailyRandomInt.js"
import { validateBody } from "../middleware/validateBody.js"
import { validateNumber } from "../middleware/validateNumber.js"

const router = express.Router()

router.get("/quotes?:limit",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(db.quotes.getAll(limit))
    }
)

router.get("/quotes/daily-quotes",
    AuthenticateUser(),
    (req, res) => {
        const limit = 100
        const quotes = db.quotes.getAll(limit)
        const i = dailyRandomInt(limit)
        const mod = Math.min(limit, quotes.length)
        res.send([
            quotes[i % mod],
            quotes[(i + 1) % mod],
            quotes[(i + 2) % mod]
        ])
    }
)

const NewQuoteSchema = z.object({ 
    utterer: z.string().trim().min(1, "Utterer must not be empty"),
    quote: z.string().trim().min(1, "Quote must not be empty")
})

router.post("/quotes/new",
    AuthenticateUser(),
    validateBody(NewQuoteSchema),
    (req, res) => {

        // Validated by middleware
        const user = req.user as AccessTokenData
        const quote = NewQuoteSchema.parse(req.body)
        
        try {
            db.quotes.insert(user.userId, quote)
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
        getAuthorInfo: id => db.quotes.get(id)
    }),
    (req: Request, res: Response) => {
        const quoteId: number = req.body.id
        try {
            db.quotes.delete(quoteId)
        } catch {
            res.status(400).send("Bad data")
        }
        res.end();
    }
)

router.post("/quotes/:id/update",
    validateNumber({
        getValue: req => req.params.id
    }),
    AuthenticateUser(),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.quotes.get(id)
    }),
    validateBody(NewQuoteSchema),
    (req: Request, res: Response) => {

        // Validated by middleware
        const quoteId = strToNumber(req.params.id) as number
        const quote = NewQuoteSchema.parse(req.body)

        try {
            db.quotes.update(quoteId, quote)
        } catch {
            return res.status(400).send("bad data")
        }
        res.end();
    }
)

export default router