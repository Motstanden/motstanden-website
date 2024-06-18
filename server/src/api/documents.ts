import express from "express"
import { documentsDb } from '../db/documents/index.js'
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"

const router = express.Router()

router.get("/documents",
    AuthenticateUser({ failureRedirect: "public/documents" }),
    (req, res) => {
        const documents = documentsDb.getAll()
        res.send(documents)
    }
)

router.get("/public/documents", (req, res) => {
    const documents = documentsDb.getAllPublic()
    res.send(documents)
})

export default router;