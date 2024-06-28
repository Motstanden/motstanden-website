import express from "express"
import { documentsApi } from "./documents.js"

const router = express.Router()

router.use(documentsApi)

export {
    router as publicRoutes
}

