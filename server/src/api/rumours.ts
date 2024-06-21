import { UserGroup } from "common/enums"
import { NewRumour, Rumour } from "common/interfaces"
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

router.get("/rumours?:limit",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(db.rumours.getAll(limit))
    })

router.get("/rumours/daily-rumour",
    AuthenticateUser(),
    (req, res) => {
        const limit = 100
        const rumours = db.rumours.getAll(limit)
        const i = dailyRandomInt(limit)
        const mod = Math.min(limit, rumours.length)
        res.send([
            rumours[i % mod],
            rumours[(i + 1) % mod],
            rumours[(i + 2) % mod],
        ])
    }
)

const NewRumourSchema = z.object({ 
    rumour: z.string().trim().min(1, "Rumour must not be empty")
})

router.post("/rumours/new",
    AuthenticateUser(),
    validateBody(NewRumourSchema),
    (req, res) => {

        // Validated by middleware
        const user = req.user as AccessTokenData
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
    AuthenticateUser(),
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
    AuthenticateUser(),
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

export default router