import express from "express"
import { commentsApi } from "./comments.js"
import { eventsApi } from "./events.js"
import { likesApi } from "./likes.js"
import { privateLyricsApi } from "./lyrics.js"
import { pollApi } from "./poll.js"
import { quotesApi } from "./quotes.js"
import { rumoursApi } from "./rumours.js"
import { sheetArchiveApi } from "./sheetArchive.js"
import { privateSimpleTextApi } from "./simpleText.js"
import { userApi } from "./user.js"
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
