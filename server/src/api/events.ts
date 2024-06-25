import { ParticipationStatus, UserGroup } from "common/enums"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams, validateQuery } from "../middleware/zodValidation.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { Schemas } from "../utils/zodSchema.js"

const router = express.Router()

// ---- GET events ----

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

// ---- POST/PATCH event ----

const UpsertEventSchema = z.object({ 
    title: z.string().trim().min(1),
    startDateTime: Schemas.z.dateTime("startDateTime must have the format: YYYY-MM-DD HH:MM:SS"),
    endDateTime: Schemas.z.dateTime("endDateTime must have the format: YYYY-MM-DD HH:MM:SS").nullable(),
    keyInfo: z.array(z.object({
        key: z.string().trim().min(1).max(16),
        value: z.string().trim().min(1).max(100)
    })),
    description: z.string().trim().min(1),
})

router.post("/events",
    AuthenticateUser(),
    validateBody(UpsertEventSchema),
    (req, res) => {
        throw "Not implemented"
    }
)

router.patch("/events/:id",
    AuthenticateUser(),
    validateParams(Schemas.params.id),
    validateBody(UpsertEventSchema),
    (req: Request, res: Response) => { 
        throw "Not implemented"        
    }
)

// ---- DELETE event ----

router.delete("/events/:id",
    AuthenticateUser(),
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        getId: req => req.body.eventId,
        getAuthorInfo: id => db.events.get(id),
        requiredGroup: UserGroup.Administrator
    }),
    (req: Request, res: Response) => {
        const { id } = Schemas.params.id.parse(req.params)
        db.events.delete(id)
        res.end()
    }
)

// ---- GET event participants ----

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

// ---- PUT event participant ----

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