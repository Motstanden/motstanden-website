import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import * as events from "../services/events";

let router = express.Router()

router.get("/events",
    AuthenticateUser(),
    (req, res) => res.send(events.getEvents({
        upcoming: !!req.body.upcoming,
        limit: !!req.body.limit ? req.body.limit : undefined 
    })))

export default router