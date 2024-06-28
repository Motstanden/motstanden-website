import express from "express"
import { commentsApi } from "./comments.js"
import { eventsApi } from "./events.js"
import { likesApi } from "./likes.js"
import { pollApi } from "./poll.js"
import { quotesApi } from "./quotes.js"
import { rumoursApi } from "./rumours.js"
import { sheetArchiveApi } from "./sheetArchive.js"
import { privateSimpleTextApi } from "./simpleText.js"

const router = express.Router()

// TODO: Add routes here
router.use(commentsApi)
router.use(eventsApi)
router.use(likesApi)
router.use(pollApi)
router.use(quotesApi)
router.use(rumoursApi)
router.use(sheetArchiveApi)
router.use(privateSimpleTextApi)

export {
    router as privateRoutes
}

