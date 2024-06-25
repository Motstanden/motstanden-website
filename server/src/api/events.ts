import { ParticipationStatus, UserGroup } from "common/enums"
import { UpsertEventData } from "common/interfaces"
import express, { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams, validateQuery } from "../middleware/zodValidation.js"
import { DbWriteAction } from "../ts/enums/DbWriteAction.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { UpsertDb } from "../ts/types/UpsertDb.js"
import { Schemas } from "../utils/zodSchema.js"

const router = express.Router()

const GetEventsQuerySchema = z.object({
    
    limit: Schemas.queries.limit.shape.limit,

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
    validateQuery(GetEventsQuerySchema),
    (req, res) => {

        // Validated by middleware
        const { limit, filter } = GetEventsQuerySchema.parse(req.query)

        const data = db.events.getAll( { filter: filter, limit: limit })
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

router.get("/events/:id/participants",
    AuthenticateUser(),
    validateParams(Schemas.params.id),
    (req: Request, res: Response) => {
        
        // Validated by middleware
        const { id: eventId } = Schemas.params.id.parse(req.params)

        const participants = db.events.participants.getAll(eventId)
        res.json(participants)
    }
)

const UpsertParticipantParamSchema = z.object({ 
    eventId: Schemas.z.stringToInt("eventId must be a positive integer"),
    userId: Schemas.z.stringToInt("userId must be a positive integer"),
})

const UpsertParticipantBodySchema = z.object({ 
    status: z.string().pipe(z.nativeEnum(ParticipationStatus)),
})

router.put("/events/:eventId/participants/:userId",
    AuthenticateUser(),
    validateParams(UpsertParticipantParamSchema),
    validateBody(UpsertParticipantBodySchema),
    (req: Request, res: Response) => {

        // Validated by middleware
        const user = req.user as AccessTokenData
        const { eventId, userId } = UpsertParticipantParamSchema.parse(req.params)
        const { status } = UpsertParticipantBodySchema.parse(req.body)

        if(user.userId !== userId) { 
            return res.status(403).send("You can only change your own status")
        }

        db.events.participants.upsert(eventId, userId, status)
        res.end()
    }
)

export default router