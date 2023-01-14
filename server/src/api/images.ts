import { UserGroup } from "common/enums";
import { ImageAlbum, NewImageAlbum, UpdateImageAlbum } from "common/interfaces";
import { strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { AuthoredItem, requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js";
import { imageAlbumService } from "../services/imageAlbum.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

const router = express.Router()

router.get("/image-album/all", 
    AuthenticateUser(),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString())
        try {
            const albums = imageAlbumService.getAll(limit)
            res.send(albums)
        } catch (err) {
                console.log(err)
                res.status(500).send("Server error")
            }
        }
)
    
router.get("/image-album/:id/images",
    AuthenticateUser(),
    (req, res) => {
    
        const id = strToNumber(req.params.id)
        if (!id) {
            return res.status(400).send("bad data")
        }
        
        try {
            const image = imageAlbumService.getImages(id)
            res.send(image)
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error")
        }
    }
)

router.post("/image-album/new",
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        try {
            imageAlbumService.insert(req.body as NewImageAlbum, user.userId)
        } catch (err) {
            console.log(err)
            res.status(400).send("Bad data")
        }
        res.end()
    }
)

router.post("/image-album/update",
    AuthenticateUser(),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getAuthorInfo: getAlbumAuthor
    }),
    (req, res) => {
        const user = req.user as AccessTokenData
        try {
            imageAlbumService.update(req.body as UpdateImageAlbum, user.userId)
        } catch (err) {
            console.log(err)
            res.status(400).send("Bad data")
        }
        res.end()
    }
)
    
router.post("/image-album/delete",
    AuthenticateUser(),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getAuthorInfo: getAlbumAuthor
    }),
    (req, res) => {
    
        const id: number = req.body.id
        if (!id) {
            return res.status(400).send("bad data")
        }
        
        try {
            imageAlbumService.delete(id)
        } catch (err) {
            console.log(err)
            res.status(400).send("Bad data")
        }
        res.end()
    }
)

function getAlbumAuthor(id: number): AuthoredItem | undefined {
    let album: ImageAlbum | undefined
    try {
        album = imageAlbumService.get(id)
    } catch { }

    if(!album)
        return undefined

    return { createdBy: album?.createdByUserId }
}

export default router;