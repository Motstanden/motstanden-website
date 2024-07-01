import { ParticipationStatus, UserGroup } from "common/enums"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams, validateQuery } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

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
    validateQuery(GetEventsQuerySchema),
    (req, res) => {
        const { limit, filter } = GetEventsQuerySchema.parse(req.query)

        const data = db.events.getAll( { filter: filter, limit: limit })
        res.json(data)
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
    validateBody(UpsertEventSchema),
    (req, res) => {
        const event = UpsertEventSchema.parse(req.body)
        const user = getUser(req)

        const newEventId = db.events.insert(event, user.userId)
        res.json({ id: newEventId })
    }
)

router.patch("/events/:id",
    validateParams(Schemas.params.id),
    validateBody(UpsertEventSchema),
    (req: Request, res: Response) => { 

        const { id: eventId } = Schemas.params.id.parse(req.params)        
        const event = UpsertEventSchema.parse(req.body)
        const user = getUser(req)

        db.events.update(event, eventId, user.userId)
        res.end()
    }
)

// ---- DELETE event ----

router.delete("/events/:id",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        getId: req => Schemas.params.id.parse(req.params).id,
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
    validateParams(Schemas.params.id),
    (req: Request, res: Response) => {
        const { id: eventId } = Schemas.params.id.parse(req.params)

        const participants = db.events.participants.getAll(eventId)
        res.json(participants)
    }
)

// ---- PUT event participant ----

const UpsertParticipantBodySchema = z.object({ 
    status: z.string().pipe(z.nativeEnum(ParticipationStatus)),
})

router.put("/events/:id/participants/me",
    validateParams(Schemas.params.id),
    validateBody(UpsertParticipantBodySchema),
    (req: Request, res: Response) => {
        const user = getUser(req)
        const { id: eventId } = Schemas.params.id.parse(req.params)
        const { status } = UpsertParticipantBodySchema.parse(req.body)

        db.events.participants.upsert(eventId, user.userId, status)
        res.end()
    }
)

export {
    router as eventsApi
}

