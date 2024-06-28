import express from "express"
import { authApi } from "./auth.js"
import { documentsApi } from "./documents.js"

const router = express.Router()

router.use(authApi)
router.use(documentsApi)

export {
    router as publicRoutes
}

