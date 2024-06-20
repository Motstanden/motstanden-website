import { UserGroup } from "common/enums"
import { SheetArchiveTitle } from "common/interfaces"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroup } from "../middleware/requiresGroup.js"

const router = express.Router()

router.get("/sheet_archive/song_title",
    AuthenticateUser(),
    (req, res) => {
        try {
            const sheets = db.sheetArchive.titles.getAll()
            res.send(sheets);
        } catch (err) {
            console.log(err)
            return res.status(400).send("Bad data");
        }
    }
)

router.get("/sheet_archive/song_files",
    AuthenticateUser(),
    (req, res) => {
        
        let param = req.query.id
        let id: number | undefined
        if (typeof param === "string") {
            id = strToNumber(param)
        }
        else if (typeof param === "number") {
            id = param
        }
        if (!id) {
            return res.status(400).send("bad data")
        }

        try {
            const sheets = db.sheetArchive.files.getAll(id);
            res.send(sheets);
        } catch (err) {
            console.log(err)
            return res.status(400).send("Bad data");
        }
    }
)


router.post("/sheet-archive/titles/update", 
    requiresGroup(UserGroup.Administrator),
    (req: Request, res: Response) => {
        const title: SheetArchiveTitle = req.body
        try {
            db.sheetArchive.titles.update(title)
        } catch(err) {
            console.log(err)
            return res.status(400).send("bad data")
        }
        res.end()
    } 
)

export default router;