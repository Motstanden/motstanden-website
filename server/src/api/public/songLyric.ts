import express from "express"
import { db } from "../../db/index.js"
import { AuthenticateUser } from "../../middleware/jwtAuthenticate.js"
import { validateParams } from "../../middleware/zodValidation.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

router.get("/lyrics", (req, res) => { 
    const lyrics = db.songLyrics.getSimplifiedList()
    res.json(lyrics)
})

router.get("/private/song-lyric/:id", 
    AuthenticateUser(),
    validateParams(Schemas.params.id),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)
        const lyric = db.songLyrics.get(id)

        if(lyric === undefined)
            return res.status(404).send("Song lyric not found")

        res.json(lyric)
    }
)

router.get("/public/song-lyric/:id",
    validateParams(Schemas.params.id),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)

        const privateLyric = db.songLyrics.get(id)

        if(privateLyric === undefined)
            return res.status(404).send("Song lyric not found")

        const filteredLyric = {
            id: privateLyric.id,
            title: privateLyric.title,
            content: privateLyric.content
        }
        res.json(filteredLyric)
    }
)

export {
    router as publicSongLyricApi
}

