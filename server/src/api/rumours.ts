import { UserGroup } from "common/enums"
import { NewRumour, Rumour } from "common/interfaces"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import dailyRandomInt from "../utils/dailyRandomInt.js"

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

router.post("/rumours/new",
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        try {
            db.rumours.insert(req.body as NewRumour, user.userId)
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

router.post("/rumours/update",
    AuthenticateUser(),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: id => db.rumours.get(id)
    }),
    (req: Request, res: Response) => {
        const rumour: Rumour = req.body
        try {
            db.rumours.update(rumour.id, rumour.rumour)
        } catch (err) {
            res.status(400).send("Bad data")
        }
        res.end()
    }
)

export default router