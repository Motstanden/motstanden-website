import { NewRumour } from "common/interfaces";
import express, { NextFunction, Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import { rumourService } from "../services/rumours"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";

let router = express.Router()

router.get("/rumours", AuthenticateUser(), (req, res) => res.send(rumourService.getAll()))

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

export default router