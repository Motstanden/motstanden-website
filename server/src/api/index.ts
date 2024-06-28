import express from "express"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { privateRoutes } from "./private/index.js"
import { publicRoutes } from "./public/index.js"
import songLyric from "./songLyric.js"

const router = express.Router()

// NOTE: The order is very important!!!

// TODO: Split up this file and put it into private/public folders
router.use(songLyric)

// Public routes
router.use(publicRoutes)

// Force all routes below this to require authentication
router.use(AuthenticateUser())

// Private routes
router.use(privateRoutes)

export {
    router as apiRoutes
}

