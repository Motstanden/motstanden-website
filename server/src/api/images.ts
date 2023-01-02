import { UserGroup } from "common/enums";
import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { imageAlbumService } from "../services/imageAlbum.js";

const router = express.Router()

router.get("/image-albums?:limit", 
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        console.log("Fetching image albums")
        try {
            const albums = imageAlbumService.getAll(limit)
            res.send(albums)
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error")
        }
    }
)

router.get("/image-albums/:id",
    AuthenticateUser(),
    (req, res) => {
        res.status(501).end()
    }
)


export default router;