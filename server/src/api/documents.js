import Database from 'better-sqlite3';
import express from "express";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";

let router = express.Router()

router.get("/documents",
    AuthenticateUser({ failureRedirect: "documents_public" }),
    (req, res) => {
        const db = new Database(motstandenDB, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT title, filename AS url FROM document ORDER BY document_id DESC")
        const documents = stmt.all();
        res.send(documents)
        db.close()
    }
)

router.get("/documents_public", (req, res) => {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT \
                                title, \
                                filename AS url \
                            FROM \
                                document \
                            WHERE \
                                is_public=1\
                            ORDER BY \
                                document_id DESC")
    const documents = stmt.all();
    res.send(documents)
    db.close()
})

export default router;