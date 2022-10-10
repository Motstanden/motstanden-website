import { UserGroup } from "common/enums";
import { ParticipationList, UpsertEventData, UpsertParticipant } from "common/interfaces";
import { strToNumber } from "common/utils";
import express, { NextFunction, Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import * as eventParticipant from "../services/eventParticipant";
import * as events from "../services/events";
import { DbWriteAction } from "../ts/enums/DbWriteAction";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import { UpsertDb } from "../ts/types/UpsertDb";
import { hasGroupAccess } from "../utils/accessTokenUtils";

let router = express.Router()

router.get("/events/upcoming",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(events.getEvents({ upcoming: true, limit: limit }))
    }
)

router.get("/events/previous",
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        res.send(events.getEvents({ upcoming: true, limit: limit }))
    }
)

router.get("/events/all",
    AuthenticateUser(),
    (req, res) => res.send(
        [
            ...events.getEvents({ upcoming: true }),
            ...events.getEvents({ upcoming: false })
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
        const eventId = events.upsertEvent(payload, user.userId, writeAction)
        res.json({ eventId: eventId })
    } catch (err) {
        console.log(err)
        res.status(400).send("Failed to create event")
    }
    res.end()
}


router.post("/events/delete",
    AuthenticateUser(),
    (req: Request, res: Response, next: NextFunction) => {

        // Check if the posted eventId is valid
        const eventId: number | unknown = req.body.eventId
        if (!eventId || typeof eventId !== "number") {
            return res.status(400).send("Bad data")
        }
        let event
        try {
            event = events.getEvent(eventId)
        } catch {
            return res.status(400).send("bad data")
        }

        // Delete the event if the user is admin, or if the user is the original author of the event
        const user = req.user as AccessTokenData
        const isAdmin = hasGroupAccess(user, UserGroup.Administrator)
        const isEventAuthor = event.createdByUserId === user.userId
        if (isAdmin || isEventAuthor) {
            events.deleteEvent(eventId)
            return res.end()
        }

        res.status(401).send("Unauthorized")
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

        let participants: ParticipationList
        try {
            participants = eventParticipant.getAll(eventId)
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
            eventParticipant.upsert(newData.eventId, user.userId, newData.participationStatus)
        } catch {
            return res.status(400).send("bad data")
        }
        res.end()
    }
)

export default router