import express from "express"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import login from "./auth.js"
import comments from "./comments.js"
import documents from "./documents.js"
import events from "./events.js"
import likes from "./likes.js"
import poll from "./poll.js"
import { privateRoutes } from "./private/index.js"
import { publicRoutes } from "./public/index.js"
import rumours from "./rumours.js"
import sheetArchive from "./sheetArchive.js"
import simpleText from "./simpleText.js"
import songLyric from "./songLyric.js"
import user from "./user.js"
import wallPosts from "./wallPosts.js"

const router = express.Router()

// TODO: Move these routes to public/private folders
router.use(comments)
router.use(documents)
router.use(events)
router.use(likes)
router.use(login)
router.use(poll)
router.use(rumours)
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

