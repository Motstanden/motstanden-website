import { UserGroup } from "common/enums"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateNumber } from "../../middleware/validateNumber.js"
import { validateBody } from "../../middleware/zodValidation.js"
import dailyRandomInt from "../../utils/dailyRandomInt.js"
import { getUser } from "../../utils/getUser.js"

const router = express.Router()

router.get("/rumours?:limit", (req, res) => {
    const limit = strToNumber(req.query.limit?.toString())
    res.send(db.rumours.getAll(limit))
})

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

        // Validated by middleware
        const user = getUser(req)
        const body = NewRumourSchema.parse(req.body)

        try {
            db.rumours.insert(user.userId, body.rumour)
        } catch (err) {
            console.log(err)
            res.status(400).send("Bad data")
        }
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
        try {
            db.rumours.delete(id)
        } catch {
            res.status(400).send("Bad data")
        }
        res.end()
    }
)

router.post("/rumours/:id/update",
    validateNumber({
        getValue: req => req.params.id
    }),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.rumours.get(id)
    }),
    validateBody(NewRumourSchema),
    (req: Request, res: Response) => {

        // Validated by middleware
        const rumourId = strToNumber(req.params.id) as number
        const body =  NewRumourSchema.parse(req.body)
        
        try {
            db.rumours.update(rumourId, body.rumour)
        } catch (err) {
            res.status(400).send("Bad data")
        }
        res.end()
    }
)

export {
    router as rumoursApi
}

