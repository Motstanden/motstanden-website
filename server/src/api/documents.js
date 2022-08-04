import express from "express";
import Database from 'better-sqlite3'
import { motstandenDB, dbReadOnlyConfig, dbReadWriteConfig } from "../config/databaseConfig.js";
import passport from "passport";

let router = express.Router()

router.get("/documents", 
    passport.authenticate("jwt", {session: false, failureRedirect: "documents_public"}),
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