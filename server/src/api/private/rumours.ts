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

router.get("/rumours?:limit",
    validateQuery(Schemas.queries.limit),
    (req, res) => {
        const { limit } = Schemas.queries.limit.parse(req.query)
        const rumours = db.rumours.getAll(limit)
        res.json(rumours)
    }
)

router.get("/rumours/random-daily", (req, res) => {
    const limit = 100
    const rumours = db.rumours.getAll(limit)
    const i = dailyRandomInt(limit)
    const mod = Math.min(limit, rumours.length)
    res.send([
        rumours[i % mod],
        rumours[(i + 1) % mod],
        rumours[(i + 2) % mod],
    ])
})

const NewRumourSchema = z.object({ 
    rumour: z.string().trim().min(1, "Rumour must not be empty")
})

router.post("/rumours/new",
    validateBody(NewRumourSchema),
    (req, res) => {
        const user = getUser(req)
        const body = NewRumourSchema.parse(req.body)

        db.rumours.insert(user.userId, body.rumour)
        res.end()
    }
)

router.post("/rumours/delete",
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: (id) => db.rumours.get(id)
    }),
    (req: Request, res: Response) => {
        const id: number = req.body.id
        db.rumours.delete(id)
        res.end()
    }
)

router.post("/rumours/:id/update",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.rumours.get(id)
    }),
    validateBody(NewRumourSchema),
    (req: Request, res: Response) => {
        const { id } = Schemas.params.id.parse(req.params)
        const body =  NewRumourSchema.parse(req.body)
        
        db.rumours.update(id, body.rumour)
        res.end()
    }
)

export {
    router as rumoursApi
}

