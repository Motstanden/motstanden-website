import express from "express"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { privateRoutes } from "./private/index.js"
import { publicRoutes } from "./public/index.js"
import songLyric from "./songLyric.js"
import wallPosts from "./wallPosts.js"

const router = express.Router()

// TODO: Move these routes to public/private folders
router.use(songLyric)
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

