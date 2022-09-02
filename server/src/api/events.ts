import { UserGroup } from "common/enums";
import { NewEventData, User } from "common/interfaces";
import express, { NextFunction, Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import * as events from "../services/events";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import { hasGroupAccess } from "../utils/accessTokenUtils";

let router = express.Router()

router.get("/events/upcoming",
    AuthenticateUser(),
    (req, res) => res.send(
        events.getEvents( { 
            upcoming: true,
            limit: !!req.body.limit ? req.body.limit : undefined 
        })
    )
)

router.get("/events/previous",
    AuthenticateUser(),
    (req, res) => res.send(
        events.getEvents( { 
            upcoming: false,
            limit: !!req.body.limit ? req.body.limit : undefined 
        })
    )
)

router.get("/events/all", 
    AuthenticateUser(),
    (req, res) => res.send(
        [
            ...events.getEvents({upcoming: true}),
            ...events.getEvents({upcoming: false})
        ]
        
    )
)

router.post("/events/new", 
    AuthenticateUser(),
    (req: Request, res: Response) => {
        const payload = req.body as NewEventData
        if(!payload) {
            res.status(400).send("Bad data")
        }

        const user = req.user as AccessTokenData
        if(!user) {
            res.status(401).send("Unauthorized")
        }

        try {
            const eventId = events.newEvent(payload, user.userId)
            res.json({eventId: eventId})
        } catch (err) {
            console.log(err)
            res.status(400).send("Failed to create event")
        }
        res.end()
    }
)

router.post("/events/delete",
    AuthenticateUser(),
    (req: Request, res: Response, next: NextFunction) => {

        // Check if the posted eventId is valid
        const eventId: number | unknown = req.body.eventId
        if(!eventId || typeof eventId !== "number"){
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
        if(isAdmin || isEventAuthor){
            events.deleteEvent(eventId)
            return res.end()
        }
        
        res.status(401).send("Unauthorized")
    }
)
export default router