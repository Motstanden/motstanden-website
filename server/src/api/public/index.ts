import express from "express"
import { authApi } from "./auth.js"
import { documentsApi } from "./documents.js"
import { publicLyricsApi } from "./lyrics.js"
import { publicSimpleTextApi } from "./simpleTexts.js"

const router = express.Router()

router.use(authApi)
router.use(documentsApi)
router.use(publicLyricsApi)
router.use(publicSimpleTextApi)

export {
    router as publicRoutes
}

