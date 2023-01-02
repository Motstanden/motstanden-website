import { strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { imageAlbumService } from "../services/imageAlbum.js";

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
    
router.get("/image-album/:id",
    AuthenticateUser(),
    (req, res) => {
    
        const id = strToNumber(req.params.id)
        if (!id) {
            return res.status(400).send("bad data")
        }
        
        try {
            const image = imageAlbumService.get(id)
            res.send(image)
        } catch (err) {
            console.log(err)
            res.status(500).send("Server error")
        }
    }
)
    
    
export default router;