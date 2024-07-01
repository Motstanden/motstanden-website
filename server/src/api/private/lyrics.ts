import { UserGroup } from "common/enums"
import { strToNumber } from "common/utils"
import express from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

const NewSongLyricSchema = z.object({ 
    title: z.string().trim().min(1, "Title must not be empty"),
    content: z.string().trim().min(1, "Content must not be empty"),
    isPopular: z.boolean()
})


router.post("/lyrics/new",
    validateBody(NewSongLyricSchema),
    (req, res) => {
        const user = getUser(req)
        const newLyric = NewSongLyricSchema.parse(req.body)

        db.songLyrics.insert(newLyric, user.userId)
        res.end()
    }
)

router.post("/lyrics/:id/update",
    validateParams(Schemas.params.id),
    validateBody(NewSongLyricSchema),
    (req, res) => {
        const user = getUser(req)
        const { id } = Schemas.params.id.parse(req.params)
        const newLyric = NewSongLyricSchema.parse(req.body)

        db.songLyrics.update(newLyric, id, user.userId)
        res.end()
    }
)

router.post("/lyrics/:id/delete",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => strToNumber(req.params.id),
        getAuthorInfo: (id) => db.songLyrics.get(id)
    }),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)
        db.songLyrics.delete(id)
        res.end()
    }
)

export {
    router as privateLyricsApi
}

