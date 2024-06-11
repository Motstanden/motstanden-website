import { UserGroup } from "common/enums";
import { Count, NewWallPost } from "common/interfaces";
import { isNullOrWhitespace, strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { wallPostService } from "../services/wallPosts.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

const router = express.Router()

router.get("/wall-posts/all?:userId",
    AuthenticateUser(),
    (req, res) => {
        const userId = strToNumber(req.query.userId?.toString())
        const posts = wallPostService.getAll(userId)
        res.send(posts)
    }
)

router.get("/wall-posts/:id",
    AuthenticateUser(),
    validateNumber({
        getValue: req => req.params.id,
    }),
    (req, res) => {
        const postId = strToNumber(req.params.postId) as number         // Validated by middleware
        try {
            const post = wallPostService.get(postId)
            if (!post) {
                return res.status(404).send("Post not found")
            }
            res.send(post)
        } catch (err) {
            console.error(err)
            res.status(500).send("Failed to get post from database")
        }
        res.end()
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
            wallPostService.incrementUnreadCount(user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send("Failed to insert post into database")
        }
        res.end()
    }
)

router.delete("/wall-posts/:id",
    AuthenticateUser(),
    validateNumber({
        getValue: req => req.params.id,
    }),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => strToNumber(req.params.id),
        getAuthorInfo: (id) => wallPostService.get(id)
    }),
    (req, res) => {
        const postId = strToNumber(req.params.postId) as number     // is validated by middleware
        try {
            wallPostService.delete(postId)
            wallPostService.decrementAllUnreadCount()
        } catch (err) {
            res.status(500).send("Failed to delete post from the database")
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

router.get("/wall-posts/unread/count", 
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        
        const unreadCount = wallPostService.getUnreadCount(user.userId)
        if(unreadCount === undefined) { 
            wallPostService.resetUnreadCount(user.userId)
        }
        const result: Count = {
            count: unreadCount ?? 0
        }

        res.send(result)
    }
)

router.post("/wall-posts/unread/count/reset", 
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        wallPostService.resetUnreadCount(user.userId)
        res.end()
    }
)

export default router