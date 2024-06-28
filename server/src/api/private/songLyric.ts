// TODO: Split up this file and put it into private/public folders

import { UserGroup } from "common/enums"
import { strToNumber } from "common/utils"
import express from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateNumber } from "../../middleware/validateNumber.js"
import { validateBody } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"

const router = express.Router()

const NewSongLyricSchema = z.object({ 
    title: z.string().trim().min(1, "Title must not be empty"),
    content: z.string().trim().min(1, "Content must not be empty"),
    isPopular: z.boolean()
})

router.post("/lyrics/:id/update",
    validateNumber({
        getValue: (req) => req.params.id,
    }),
    validateBody(NewSongLyricSchema),
    (req, res) => {

        // Validated by middleware
        const id = strToNumber(req.params.id) as number
        const user = getUser(req)
        const newLyric = NewSongLyricSchema.parse(req.body)

        if(!newLyric)
            return res.status(400).send("Could not parse song lyric data")

        try {
            db.songLyrics.update(newLyric, id, user.userId)
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to update song lyric in the database")
        }
        res.end()
    }
)

router.post("/lyrics/new",
    validateBody(NewSongLyricSchema),
    (req, res) => {

        // Validated by middleware
        const user = getUser(req)
        const newLyric = NewSongLyricSchema.parse(req.body)

        try {
            db.songLyrics.insert(newLyric, user.userId)
        } catch (err) {
            console.log(err)
            res.status(400).send("Failed to insert new song lyric into the database")
        }
        res.end()
    }
)

router.post("/lyrics/:id/delete",
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => strToNumber(req.params.id),
        getAuthorInfo: (id) => db.songLyrics.get(id)
    }),
    (req, res) => {
        const id = strToNumber(req.params.id) as number     // is validated by middleware
        try {
            db.songLyrics.delete(id)
        } catch (err) {
            res.status(500).send("Failed to delete song lyric from the database")
        }
        res.end()
    }
)

export {
    router as privateSongLyricApi
}

