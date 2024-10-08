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

// ---- GET rumours ----

router.get("/rumours?:limit",
    validateQuery(Schemas.queries.limit),
    (req, res) => {
        const { limit } = Schemas.queries.limit.parse(req.query)
        const { userId } = getUser(req)
        const rumours = db.rumours.getAll({
            currentUserId: userId,
            limit: limit
        })
        res.json(rumours)
    }
)

router.get("/rumours/random-daily", (req, res) => {
    const limit = 100
    const { userId } = getUser(req)
    const rumours = db.rumours.getAll({
        currentUserId: userId,
        limit: limit
    })
    const i = dailyRandomInt(limit)
    const mod = Math.min(limit, rumours.length)
    res.send([
        rumours[i % mod],
        rumours[(i + 1) % mod],
        rumours[(i + 2) % mod],
    ])
})

// ---- POST rumours ----

const NewRumourSchema = z.object({ 
    rumour: z.string().trim().min(1, "Rumour must not be empty")
})

router.post("/rumours",
    validateBody(NewRumourSchema),
    (req, res) => {
        const user = getUser(req)
        const body = NewRumourSchema.parse(req.body)

        db.rumours.insert(user.userId, body.rumour)
        res.end()
    }
)

// ---- DELETE rumours ----

router.delete("/rumours/:id",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => Schemas.params.id.parse(req.params).id,
        getAuthorInfo: (id) => db.rumours.getAuthorInfo(id)
    }),
    (req: Request, res: Response) => {
        const { id } = Schemas.params.id.parse(req.params)
        db.rumours.delete(id)
        res.end()
    }
)

// ---- UPDATE rumours ----

router.patch("/rumours/:id",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.rumours.getAuthorInfo(id)
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

