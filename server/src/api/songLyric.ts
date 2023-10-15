import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { songLyricService } from "../services/songLyric.js";

const router = express.Router()

router.get("/song-lyric/simple-list", (req, res) => { 
    const lyrics = songLyricService.getSimpleList()
    res.send(lyrics)
})

router.get("/private/song-lyric/:id", 
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse song lyric id"
    }),
    AuthenticateUser(),
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
            const privateLyric = songLyricService.get(id)

            const filteredLyric = isPublic ? {
                id: privateLyric.id,
                title: privateLyric.title,
                content: privateLyric.content
            } : privateLyric
            res.send(filteredLyric)
        } catch (err) {
            console.log(err)
            res.status(500).end()
        }
    }
}

export default router;