import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { db } from "../../db/index.js"
import { AuthenticateUser } from "../../middleware/jwtAuthenticate.js"
import { validateNumber } from "../../middleware/validateNumber.js"

const router = express.Router()

router.get("/song-lyric/simple-list", (req, res) => { 
    const lyrics = db.songLyrics.getSimplifiedList()
    res.send(lyrics)
})

router.get("/private/song-lyric/:id", 
    AuthenticateUser(),
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse song lyric id"
    }),
    sendSongLyric({ 
        isPublic: false 
    })
)

router.get("/public/song-lyric/:id",
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse song lyric id"
    }),
    sendSongLyric({ 
        isPublic: true 
    })
)

function sendSongLyric({ isPublic }: {isPublic: boolean} ) {
    return (req: Request, res: Response) => {
        const id = strToNumber(req.params.id) as number
        try {
            const privateLyric = db.songLyrics.get(id)

            if(!privateLyric)
                return res.status(404).send("Song lyric not found");
            
            const filteredLyric = isPublic ? {
                id: privateLyric.id,
                title: privateLyric.title,
                content: privateLyric.content
            } : privateLyric
            
            res.send(filteredLyric)
        } catch (err) {
            console.error(err)
            res.status(500).end()
        }
    }
}

export {
    router as publicSongLyricApi
}

