import Database from "better-sqlite3";
import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js";
import { songLyricService } from "../services/songLyric.js";
import { strToNumber } from "common/utils";

const router = express.Router()

router.get("/song-lyric/simple-list", (req, res) => { 
    const lyrics = songLyricService.getSimpleList()
    res.send(lyrics)
})

router.get("/song-lyric/:id", (req, res) => {
    const id = strToNumber(req.params.id) as number
    try {
        const lyric = songLyricService.get(id)
        res.send(lyric)
    } catch (err) {
        console.log(err)
        res.status(500).end()
    }
})

export default router;