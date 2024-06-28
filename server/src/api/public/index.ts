import express from "express"
import { authApi } from "./auth.js"
import { documentsApi } from "./documents.js"
import { publicSimpleTextApi } from "./simpleText.js"

const router = express.Router()

router.use(authApi)
router.use(documentsApi)
router.use(publicSimpleTextApi)

export {
    router as publicRoutes
}

