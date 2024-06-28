import express from "express"
import { commentsApi } from "./comments.js"
import { quotesApi } from "./quotes.js"

const router = express.Router()

// TODO: Add routes here
router.use(commentsApi)
router.use(quotesApi)

export {
    router as privateRoutes
}

