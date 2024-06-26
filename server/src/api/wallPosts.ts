import { UserGroup } from "common/enums"
import { Count } from "common/interfaces"
import { strToNumber } from "common/utils"
import express from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresAuthor, requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { validateNumber } from "../middleware/validateNumber.js"
import { validateBody } from "../middleware/zodValidation.js"
import { getUser } from "../utils/getUser.js"

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

const NewWallPostSchema = z.object({
    content: z.string().trim().min(1, "Content must not be empty"),
    wallUserId: z.coerce.number().int().positive().finite(),
})

router.post("/wall-posts/new",
    AuthenticateUser(),
    validateBody(NewWallPostSchema),
    (req, res) => {
        
        // Validated by middleware
        const user = getUser(req)
        const newPost = NewWallPostSchema.parse(req.body)

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

const UpdateWallPostSchema = z.object({ 
    content: z.string().trim().min(1, "Content must not be empty")
})

router.patch("/wall-posts/:id",
    AuthenticateUser(),
    requiresAuthor( {
        getId: req => strToNumber(req.params.id),
        getAuthorInfo: id => db.wallPosts.get(id)
    }),
    validateBody(UpdateWallPostSchema),
    (req, res) => {

        // Validated by middleware
        const id = strToNumber(req.params.id) as number 
        const data = UpdateWallPostSchema.parse(req.body)
            
        try {
            db.wallPosts.updateContent(id, data.content)
        } catch (err) {
            console.error(err)
            res.status(500).send("Failed to update post in database")
        }
        res.end()
    }
)

router.get("/wall-posts/unread/count", 
    AuthenticateUser(),
    (req, res) => {
        const user = getUser(req)
        
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
        const user = getUser(req)
        db.wallPosts.resetUnreadCount(user.userId)
        res.end()
    }
)

export default router