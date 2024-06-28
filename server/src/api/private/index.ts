import express from "express"
import { quotesApi } from "./quotes.js"

const router = express.Router()

// TODO: Add routes here
router.use(quotesApi)

export {
    router as privateRoutes
}

