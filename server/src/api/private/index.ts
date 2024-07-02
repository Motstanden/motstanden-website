import express from "express"
import { commentsApi } from "./comments.js"
import { eventsApi } from "./events.js"
import { likesApi } from "./likes.js"
import { privateLyricsApi } from "./lyrics.js"
import { pollApi } from "./polls.js"
import { quotesApi } from "./quotes.js"
import { rumoursApi } from "./rumours.js"
import { sheetArchiveApi } from "./sheetMusic.js"
import { privateSimpleTextApi } from "./simpleTexts.js"
import { userApi } from "./users.js"
import { wallPostApi } from "./wallPosts.js"

const router = express.Router()

router.use(commentsApi)
router.use(eventsApi)
router.use(likesApi)
router.use(privateLyricsApi)
router.use(pollApi)
router.use(quotesApi)
router.use(rumoursApi)
router.use(sheetArchiveApi)
router.use(privateSimpleTextApi)
router.use(userApi)
router.use(wallPostApi)

export {
    router as privateRoutes
}

