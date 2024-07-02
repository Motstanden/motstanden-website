import { UserGroup } from "common/enums"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { RequiresGroup } from "../../middleware/requiresGroup.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

// ---- GET songs/files ----

router.get("/sheet-music/songs", (req, res) => {
    const songs = db.sheetArchive.titles.getAll()
    res.json(songs);
})

router.get("/sheet-music/songs/:id/files", 
    validateParams(Schemas.params.id),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)
        const sheets = db.sheetArchive.files.getAll(id);
        res.send(sheets);
})

// ---- PATCH song ----

const UpdateSheetMusicSongSchema = z.object({ 
    title: z.string().trim().min(1, "Title must not be empty"),
    extraInfo: z.string().trim(),
    isRepertoire: z.boolean()
})

router.patch("/sheet-music/songs/:id", 
    validateParams(Schemas.params.id),
    RequiresGroup(UserGroup.Administrator),
    validateBody(UpdateSheetMusicSongSchema),
    (req: Request, res: Response) => {
        const { id } = Schemas.params.id.parse(req.params)
        const song = UpdateSheetMusicSongSchema.parse(req.body)
        
        db.sheetArchive.titles.update(id, song)
        res.end()
    } 
)

export {
    router as sheetArchiveApi
}

