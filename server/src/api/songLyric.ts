import Database from "better-sqlite3";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js";
import { songLyricService } from "../services/songLyric.js";

const router = express.Router()

router.get("/song-lyric/simple-list", (req, res) => { 
    const lyrics = songLyricService.getList()
    res.send(lyrics)
})

router.get("/song-lyric/:title", (req, res) => {
    res.send({ id: 0, title: req.params.title, content: "TODO..." })
})

router.get("/song_lyric", (req, res) => {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT \
                                title, \
                                filename as url, \
                                song_melody AS melody, \
                                song_text_origin AS textOrigin, \
                                song_description AS description \
                            FROM song_lyric ORDER BY title")
    const lyrics = stmt.all()
    res.send(lyrics)
    db.close()
})

router.get("/song_lyric_data", (req, res) => {

    // Get the name of the html file
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT filename AS file FROM song_lyric WHERE title = ?")
    const title = req.query.title;
    const rows = stmt.get([title])
    if (!rows) {
        res.status(400)
        res.end()
    }
    const filename = fileURLToPath(new URL(`../../${rows.file}`, import.meta.url))
    db.close()

    // Send html file as string
    fs.readFile(filename, (err, data) => {
        if (err) {
            res.status(400)
        }
        else {
            res.json({ lyricHtml: data.toString() })
        }
    });
})

export default router;