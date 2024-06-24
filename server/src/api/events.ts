import { UserGroup } from "common/enums"
import { EventData, Participant, UpsertEventData, UpsertParticipant } from "common/interfaces"
import { strToNumber } from "common/utils"
import express, { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { DbWriteAction } from "../ts/enums/DbWriteAction.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { UpsertDb } from "../ts/types/UpsertDb.js"
import { StringToIntegerSchema } from "../utils/zodSchema.js"

const router = express.Router()

const GetEventsParamsSchema = z.object({
    
    limit: StringToIntegerSchema("Limit must be an integer number").optional(),

    // Ensures filter is: "upcoming" | "previous" | undefined
    filter: z.string()
        .trim()
        .toLowerCase()
        .pipe(z.union([
            z.literal("upcoming"),
            z.literal("previous"),
            z.literal("").transform(() => undefined),   // Transform empty string to undefined
        ]))
        .optional()
})
  

router.get("/events",
    AuthenticateUser(),
    (req, res) => {

        const params = GetEventsParamsSchema.safeParse(req.query) 
        if(!params.success) 
            return res.status(400).send("Invalid params")

        const { limit, filter } = params.data

        let data: EventData[]
        if(filter === undefined) {
            data = [
                ...db.events.getAll({ upcoming: true, limit: limit }),
                ...db.events.getAll({ upcoming: false, limit: limit })
            ]
        } else {
            data = db.events.getAll({ upcoming: filter === "upcoming", limit: limit })
        }

        res.send(data)
    }
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