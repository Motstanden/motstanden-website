import { UserGroup } from "common/enums"
import { Count, NewWallPost } from "common/interfaces"
import { isNullOrWhitespace, strToNumber } from "common/utils"
import express from "express"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresAuthor, requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { validateNumber } from "../middleware/validateNumber.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { db } from "../db/index.js"

const router = express.Router()

router.get("/wall-posts/all?:userId",
    AuthenticateUser(),
    (req, res) => {
        const userId = strToNumber(req.query.userId?.toString())
        const posts = db.wallPosts.getAll(userId)
        res.send(posts)
    }
)

router.get("/wall-posts/:id",
    AuthenticateUser(),
    validateNumber({
        getValue: req => req.params.id,
    }),
    (req, res) => {
        const postId = strToNumber(req.params.id) as number         // Validated by middleware
        try {
            const post = db.wallPosts.get(postId)
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
            db.wallPosts.insertPostAndMarkUnread(newPost, user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send("Failed to insert post into database")
        }
        res.end()
    }
)

router.delete("/wall-posts/:id",
    AuthenticateUser(),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => strToNumber(req.params.id),
        getAuthorInfo: (id) => db.wallPosts.get(id)
        }),
    (req, res) => {
        const postId = strToNumber(req.params.id) as number     // is validated by middleware
        try {
            db.wallPosts.delete(postId)
        } catch (err) {
            res.status(500).send("Failed to delete post from the database")
        }
        res.end()
    }
)

router.patch("/wall-posts/:id",
    AuthenticateUser(),
    requiresAuthor( {
        getId: req => strToNumber(req.params.id),
        getAuthorInfo: id => db.wallPosts.get(id)
    }),
    (req, res) => {
        const id = strToNumber(req.params.id) as number         // Is validated by middleware 

        const newContent = req.body.content
        if (typeof newContent !== "string" || isNullOrWhitespace(newContent)) {
            return res.status(400).send("Invalid content")
        }
            
        try {
            db.wallPosts.updateContent(id, newContent)
        } catch (err) {
            console.error(err)
            res.status(500).send("Failed to update post in database")
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
        
        const unreadCount = db.wallPosts.getUnreadCount(user.userId)
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
        db.wallPosts.resetUnreadCount(user.userId)
        res.end()
    }
)

export default router