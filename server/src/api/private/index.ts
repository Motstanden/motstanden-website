import express from "express"
import { commentsApi } from "./comments.js"
import { eventsApi } from "./events.js"
import { likesApi } from "./likes.js"
import { quotesApi } from "./quotes.js"

const router = express.Router()

// TODO: Add routes here
router.use(commentsApi)
router.use(eventsApi)
router.use(likesApi)


router.use(quotesApi)

export {
    router as privateRoutes
}

