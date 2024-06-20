import { UserGroup } from "common/enums"
import { Participant, UpsertEventData, UpsertParticipant } from "common/interfaces"
import { strToNumber } from "common/utils"
import express, { NextFunction, Request, Response } from "express"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { DbWriteAction } from "../ts/enums/DbWriteAction.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { UpsertDb } from "../ts/types/UpsertDb.js"

const router = express.Router()

router.get("/events/upcoming",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(db.events.getAll({ upcoming: true, limit: limit }))
    }
)

router.get("/events/previous",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(db.events.getAll({ upcoming: true, limit: limit }))
    }
)

router.get("/events/all",
    AuthenticateUser(),
    (req, res) => res.send(
        [
            ...db.events.getAll({ upcoming: true }),
            ...db.events.getAll({ upcoming: false })
        ]

    )
)

router.post("/events/new", AuthenticateUser(), (req, res) => handleUpsert(DbWriteAction.Insert, req, res))

router.post("/events/update", AuthenticateUser(), (req, res) => handleUpsert(DbWriteAction.Update, req, res))

function handleUpsert(writeAction: UpsertDb, req: Request, res: Response) {
    const payload: UpsertEventData = req.body
    if (!payload) {
        res.status(400).send("Bad data")
    }

    const user = req.user as AccessTokenData
    if (!user) {
        res.status(401).send("Unauthorized")
    }

    try {
        const eventId = db.events.upsert(payload, user.userId, writeAction)
        res.json({ eventId: eventId })
    } catch (err) {
        console.log(err)
        res.status(400).send("Failed to create event")
    }
    res.end()
}

router.post("/events/delete",
    AuthenticateUser(),
    requiresGroupOrAuthor({
        getId: req => req.body.eventId,
        getAuthorInfo: id => db.events.get(id),
        requiredGroup: UserGroup.Administrator
    }),
    (req: Request, res: Response, next: NextFunction) => {
        const id = req.body.eventId as number       // This is already validated by requiresGroupOrAuthor
        try {
            db.events.delete(id)
        } catch (err) {
            console.log(err)
            return res.status(500).send("Failed to delete event")
        }
        res.end()
    }
)

router.get("/event-participants",
    AuthenticateUser(),
    (req: Request, res: Response) => {

        let param = req.query.eventId
        let eventId: number | undefined
        if (typeof param === "string") {
            eventId = strToNumber(param)
        }
        else if (typeof param === "number") {
            eventId = param
        }
        if (!eventId) {
            return res.status(400).send("bad data")
        }

        let participants: Participant[]
        try {
            participants = db.events.participants.getAll(eventId)
            res.json(participants)
        } catch {
            return res.status(400).send("Bad data")
        }
    }
)

router.post("/event-participants/upsert",
    AuthenticateUser(),
    (req: Request, res: Response) => {
        const user = req.user as AccessTokenData
        const newData: UpsertParticipant = req.body
        try {
            db.events.participants.upsert(newData.eventId, user.userId, newData.participationStatus)
        } catch (err) {
            console.log(err)
            return res.status(400).send("bad data")
        }
        res.end()
    }
)

export default router