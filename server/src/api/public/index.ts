import express from "express"
import { authApi } from "./auth.js"
import { documentsApi } from "./documents.js"
import { publicSimpleTextApi } from "./simpleText.js"
import { publicSongLyricApi } from "./songLyric.js"

const router = express.Router()

router.use(authApi)
router.use(documentsApi)
router.use(publicSimpleTextApi)
router.use(publicSongLyricApi)

export {
    router as publicRoutes
}

