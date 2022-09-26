import express, { NextFunction, Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";
import { rumourService } from "../services/rumours"

let router = express.Router()

router.get("/rumours", AuthenticateUser(), (req, res) => res.send(rumourService.getAll()))

export default router