import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import * as events from "../services/events";

let router = express.Router()

// router.get("/events/upcoming",
//     AuthenticateUser(),
//     (req, res) => res.send(
//         events.getEvents( { 
//             upcoming: true,
//             limit: !!req.body.limit ? req.body.limit : undefined 
//         })
//     )
// )

// router.get("/events/previous",
//     AuthenticateUser(),
//     (req, res) => res.send(
//         events.getEvents( { 
//             upcoming: false,
//             limit: !!req.body.limit ? req.body.limit : undefined 
//         })
//     )
// )

// router.get("/events/all", 
//     AuthenticateUser(),
//     (req, res) => res.send(
//         [
//             ...events.getEvents({upcoming: true}),
//             ...events.getEvents({upcoming: false})
//         ]
        
//     )

// )

export default router