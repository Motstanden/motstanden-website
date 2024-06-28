import express from "express"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { privateRoutes } from "./private/index.js"
import { publicRoutes } from "./public/index.js"
import sheetArchive from "./sheetArchive.js"
import simpleText from "./simpleText.js"
import songLyric from "./songLyric.js"
import user from "./user.js"
import wallPosts from "./wallPosts.js"

const router = express.Router()

// TODO: Move these routes to public/private folders
router.use(sheetArchive)
router.use(simpleText)
router.use(songLyric)
router.use(user)
router.use(wallPosts)

// NOTE: The order is very important!!!

// Public routes
router.use(publicRoutes)

// Force all routes below this to require authentication
router.use(AuthenticateUser())

// Private routes
router.use(privateRoutes)

export {
    router as apiRoutes
}

