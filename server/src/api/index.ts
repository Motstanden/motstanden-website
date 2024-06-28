import express from "express"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { privateRoutes } from "./private/index.js"
import { publicRoutes } from "./public/index.js"

const router = express.Router()

// -----------------------------------------
//     The order is very important!!!
// -----------------------------------------

// Public routes
router.use(publicRoutes)

// Force all routes below this to require authentication
router.use(AuthenticateUser())

// Private routes
router.use(privateRoutes)

export {
    router as apiRoutes
}

