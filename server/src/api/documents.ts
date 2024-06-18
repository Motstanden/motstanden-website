import express from "express";
import { documentService } from '../db/documents.js';
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";

const router = express.Router()

router.get("/documents",
    AuthenticateUser({ failureRedirect: "public/documents" }),
    (req, res) => {
        const documents = documentService.getAll()
        res.send(documents)
    }
)

router.get("/public/documents", (req, res) => {
    const documents = documentService.getAllPublic()
    res.send(documents)
})

export default router;