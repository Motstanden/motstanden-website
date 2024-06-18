import { UserGroup } from "common/enums";
import { SheetArchiveTitle } from "common/interfaces";
import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import * as SheetArchive from "../db/sheetArchive.js";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { requiresGroup } from "../middleware/requiresGroup.js";

let router = express.Router()

router.get("/sheet_archive/song_title",
    AuthenticateUser(),
    (req, res) => {
        try {
            const sheets = SheetArchive.getTitles();
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
            const sheets = SheetArchive.getFiles(id);
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
            SheetArchive.updateTitle(title)
        } catch(err) {
            console.log(err)
            return res.status(400).send("bad data")
        }
        res.end()
    } 
)

export default router;