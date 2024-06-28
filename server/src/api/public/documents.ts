import express from "express"
import { db } from "../../db/index.js"
import { AuthenticateUser } from "../../middleware/jwtAuthenticate.js"

const router = express.Router()


router.get("/documents", 
    AuthenticateUser( { failureRedirect: "public/documents" }),
    (req, res) => res.redirect("private/documents")
)

router.get("/private/documents",
    AuthenticateUser(),
    (req, res) => {
        const documents = db.documents.getAll()
        res.send(documents)
    }
)

router.get("/public/documents", (req, res) => {
    const documents = db.documents.getAllPublic()
    res.send(documents)
})


export {
    router as documentsApi
}

