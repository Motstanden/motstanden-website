import { NewWallPost } from "common/interfaces";
import { isNullOrWhitespace, strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { wallPostService } from "../services/wallPosts.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

const router = express.Router()

router.get("/wall-posts/all?:userId",
    AuthenticateUser(),
    (req, res) => {
        const userId = strToNumber(req.query.userId?.toString() ?? "")
        const posts = wallPostService.getAll(userId)
        res.send(posts)
    }
)

router.post("/wall-posts/new",
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        const newPost = tryCreateValidPost(req.body)
        
        if(!newPost)
            return res.status(400).send("Could not parse post data")

        try {
            wallPostService.insertNew(newPost, user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send("Failed to inser post into database")
        }
        res.end()
    }
)

function tryCreateValidPost(obj: unknown): NewWallPost | undefined {
    if (typeof obj !== "object" || obj === null) {
        return undefined
    }

    const post = obj as NewWallPost

    if (typeof post.content !== "string" || isNullOrWhitespace(post.content)) {
        return undefined
    }
    
    if (typeof post.wallUserId !== "number" || post.wallUserId < 0) {
        return undefined
    }

    return {
        wallUserId: post.wallUserId,
        content: post.content.trim()
    }
}


export default router