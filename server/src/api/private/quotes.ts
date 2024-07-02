import { UserGroup } from "common/enums"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams, validateQuery } from "../../middleware/zodValidation.js"
import dailyRandomInt from "../../utils/dailyRandomInt.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

router.get("/quotes?:limit",
    validateQuery(Schemas.queries.limit),
    (req, res) => {
        const { limit } = Schemas.queries.limit.parse(req.query)
        const quotes = db.quotes.getAll(limit)
        res.json(quotes)
    }
)

router.get("/quotes/random-daily",
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
    validateBody(NewQuoteSchema),
    (req, res) => {
        const user = getUser(req)
        const quote = NewQuoteSchema.parse(req.body)

        db.quotes.insert(user.userId, quote)
        res.end();
    }
)

router.post("/quotes/delete",
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.quotes.get(id)
    }),
    (req: Request, res: Response) => {
        const quoteId: number = req.body.id
        db.quotes.delete(quoteId)
        res.end();
    }
)

router.post("/quotes/:id/update",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.quotes.get(id)
    }),
    validateBody(NewQuoteSchema),
    (req: Request, res: Response) => {
        const { id } = Schemas.params.id.parse(req.params)
        const quote = NewQuoteSchema.parse(req.body)

        db.quotes.update(id, quote)
        res.end();
    }
)

export {
    router as quotesApi
}

