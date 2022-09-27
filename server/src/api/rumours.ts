import { UserGroup } from "common/enums";
import { NewRumour, Rumour } from "common/interfaces";
import express, { NextFunction, Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor";
import { rumourService } from "../services/rumours"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import dailyRandomInt from "../utils/dailyRandomInt";

let router = express.Router()

router.get("/rumours", AuthenticateUser(), (req, res) => res.send(rumourService.getAll()))

router.get("/rumours/daily-rumour",
    AuthenticateUser(),
    (req, res) => {
        const limit = 100 
        const rumours = rumourService.getAll(limit)
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
    (req, res ) => {
        const user = req.user as AccessTokenData
        try {
            rumourService.insertNew(req.body as NewRumour, user.userId)
        } catch(err) {
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
        getAuthorInfo: (id) => rumourService.get(id)
    }),
    (req: Request, res: Response) => {
        const id: number = req.body.id
        try {
            rumourService.delete(id)
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
        getAuthorInfo: id => rumourService.get(id)
    }), 
    (req: Request, res: Response) => {
        const rumour: Rumour = req.body
        try {
            rumourService.update(rumour)
        } catch (err) {
            res.status(400).send("Bad data")
        }
        res.end()
    } 
)

export default router