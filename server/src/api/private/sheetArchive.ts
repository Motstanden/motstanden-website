import { UserGroup } from "common/enums"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { RequiresGroup } from "../../middleware/requiresGroup.js"
import { validateNumber } from "../../middleware/validateNumber.js"
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

const UpdateSheetArchiveTitleSchema = z.object({ 
    title: z.string().trim().min(1, "Title must not be empty"),
    extraInfo: z.string().trim(),
    isRepertoire: z.boolean()
})

router.post("/sheet-archive/titles/:id/update", 
    validateNumber({
        getValue: req => req.params.id,
    }),
    RequiresGroup(UserGroup.Administrator),
    validateBody(UpdateSheetArchiveTitleSchema),
    (req: Request, res: Response) => {

        // Validated by middleware
        const titleId = strToNumber(req.params.id) as number
        const title = UpdateSheetArchiveTitleSchema.parse(req.body)
        
        try {
            db.sheetArchive.titles.update(titleId, title)
        } catch(err) {
            console.log(err)
            return res.status(400).send("bad data")
        }
        res.end()
    } 
)

export {
    router as sheetArchiveApi
}

