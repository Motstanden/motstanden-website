import { UserGroup } from "common/enums"
import { Count } from "common/interfaces"
import express from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresAuthor, requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams, validateQuery } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

// ---- GET wall/posts ----

const WallPostsQuerySchema = z.object({ 
    wallUserId: Schemas.z.stringToInt("wallUserId must be a positive integer").optional(),
})

router.get("/wall/posts",
    validateQuery(WallPostsQuerySchema),
    (req, res) => {
        const { wallUserId } = WallPostsQuerySchema.parse(req.query)
        const posts = db.wallPosts.getAll(wallUserId)
        res.send(posts)
    }
)

router.get("/wall/posts/:id",
    validateParams(Schemas.params.id),
    (req, res) => {
        const { id: postId } = Schemas.params.id.parse(req.params)
        const post = db.wallPosts.get(postId)

        if (post !== undefined) {
            res.send(post)
        } else {
            res.status(404).send("Post not found")
        }
    }
)

// ---- POST wall/posts ----

const NewWallPostSchema = z.object({
    content: z.string().trim().min(1, "Content must not be empty"),
    wallUserId: z.coerce.number().int().positive().finite(),
})

router.post("/wall/posts",
    validateBody(NewWallPostSchema),
    (req, res) => {
        const user = getUser(req)
        const newPost = NewWallPostSchema.parse(req.body)
        
        db.wallPosts.insertPostAndMarkUnread(newPost, user.userId)
        res.end()
    }
)

// ---- PATCH wall/posts ----

const UpdateWallPostSchema = z.object({ 
    content: z.string().trim().min(1, "Content must not be empty")
})

router.patch("/wall/posts/:id",
    validateParams(Schemas.params.id),
    requiresAuthor( {
        getId: req => Schemas.params.id.parse(req.params).id,
        getAuthorInfo: id => db.wallPosts.get(id)
    }),
    validateBody(UpdateWallPostSchema),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)
        const data = UpdateWallPostSchema.parse(req.body)

        db.wallPosts.updateContent(id, data.content)
        res.end()
    }
)

// ---- DELETE wall/posts ----

router.delete("/wall/posts/:id",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => Schemas.params.id.parse(req.params).id,
        getAuthorInfo: (id) => db.wallPosts.get(id)
    }),
    (req, res) => {
        const { id: postId } = Schemas.params.id.parse(req.params)
        db.wallPosts.delete(postId)
        res.end()
    }
)

// ---- GET/PUT count of unread wall posts ----

router.get("/wall/posts/unread/count", (req, res) => {
    const user = getUser(req)
    
    const unreadCount = db.wallPosts.getUnreadCount(user.userId)
    const result: Count = {
        count: unreadCount ?? 0
    }

    res.send(result)
})

router.put("/wall/posts/unread/count", (req, res) => {
    const user = getUser(req)
    db.wallPosts.resetUnreadCount(user.userId)
    res.end()
})

export {
    router as wallPostApi
}

