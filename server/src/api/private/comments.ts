import { CommentEntityType, UserGroup } from "common/enums"
import { Count } from "common/interfaces"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresAuthor, requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateNumber } from "../../middleware/validateNumber.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

// ---- GET all comments ----

router.get("/comments?:limit", 
    validateNumber({
        getValue: (req: Request) =>  req.query.limit?.toString() ?? ""
    }),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString()) as number
        res.send(db.comments.getAllUnion(limit))
    }
)

// ---- Param Schemas ----
const CommentIdSchema = z.object({ 
    commentId: Schemas.z.stringToInt()
})

const EntityIdSchema = z.object({ 
    entityId: Schemas.z.stringToInt()
})

// ---- GET comments ----

router.get("/events/:entityId/comments",getCommentsPipeline(CommentEntityType.Event))
router.get("/polls/:entityId/comments", getCommentsPipeline(CommentEntityType.Poll))
router.get("/lyrics/:entityId/comments", getCommentsPipeline(CommentEntityType.SongLyric))
router.get("/wall-posts/:entityId/comments", getCommentsPipeline(CommentEntityType.WallPost))

function getCommentsPipeline(entityType: CommentEntityType) {
    return [
        validateParams(EntityIdSchema),
        getCommentsHandler(entityType)
    ]
}

function getCommentsHandler(entityType: CommentEntityType) {
    return (req: Request, res: Response) =>  {
        const { entityId } = EntityIdSchema.parse(req.params)
        const comments = db.comments.getAll(entityType, entityId)
        res.send(comments)
    }
}

// ---- POST comments ----

const NewCommentSchema = z.object({ 
    comment: z.string().trim().min(1, "Comment must not be empty")
})

router.post("/events/:entityId/comments/new", postCommentPipeline(CommentEntityType.Event))
router.post("/polls/:entityId/comments/new", postCommentPipeline(CommentEntityType.Poll))
router.post("/lyrics/:entityId/comments/new", postCommentPipeline(CommentEntityType.SongLyric))
router.post("/wall-posts/:entityId/comments/new", postCommentPipeline(CommentEntityType.WallPost))

function postCommentPipeline(entityType: CommentEntityType) { 
    return [
        validateParams(EntityIdSchema),
        validateBody(NewCommentSchema),
        postCommentHandler(entityType)
    ]
}

function postCommentHandler(entityType: CommentEntityType) {
    return (req: Request, res: Response) => {

        // Validated by middleware
        const user = getUser(req)
        const comment = NewCommentSchema.parse(req.body)
        const { entityId } = EntityIdSchema.parse(req.params)

        db.comments.insertNew(entityType, entityId, comment, user.userId)
        res.end()
    }
}

// ---- DELETE comment ----

router.delete("/events/comments/:commentId", deleteCommentPipeline(CommentEntityType.Event))
router.delete("/polls/comments/:commentId", deleteCommentPipeline(CommentEntityType.Poll))
router.delete("/lyrics/comments/:commentId", deleteCommentPipeline(CommentEntityType.SongLyric))
router.delete("/wall-posts/comments/:commentId", deleteCommentPipeline(CommentEntityType.WallPost))

function deleteCommentPipeline(entityType: CommentEntityType) { 
    return [
        validateNumber({
            getValue: req => req.params.commentId
        }),
        requiresGroupOrAuthor({
            requiredGroup: UserGroup.Administrator,
            getId: (req) => strToNumber(req.params.commentId),
            getAuthorInfo: (id) => db.comments.get(entityType, id)
        }),
        deleteCommentHandler({
            entityType: entityType,
            getCommentId: (req: Request) => strToNumber(req.params.commentId) as number
        })
    ]
}

function deleteCommentHandler( {
    entityType,
    getCommentId,
}: {
    entityType: CommentEntityType,
    getCommentId: (req: Request) => number
}) {
    return (req: Request, res: Response) => {
        const id = getCommentId(req)
        try {
            db.comments.delete(entityType, id)
        } catch (err) {
            res.status(500).send(`Failed to delete ${entityType} comment from the database`)
        }
        res.end()
    }
}

// ---- PATCH comment ----

router.patch("/events/comments/:commentId", patchCommentPipeline(CommentEntityType.Event))
router.patch("/polls/comments/:commentId", patchCommentPipeline(CommentEntityType.Poll))
router.patch("/lyrics/comments/:commentId", patchCommentPipeline(CommentEntityType.SongLyric))
router.patch("/wall-posts/comments/:commentId", patchCommentPipeline(CommentEntityType.WallPost))

function patchCommentPipeline(entityType: CommentEntityType) {
    return [
        validateNumber({
            getValue: req => req.params.commentId
        }),
        validateBody(NewCommentSchema),
        requiresAuthor({
            getId: req => strToNumber(req.params.commentId),
            getAuthorInfo: id => db.comments.get(entityType, id)
        }),
        patchCommentHandler({
            entityType: entityType,
            getCommentId: (req: Request) => strToNumber(req.params.commentId) as number
        })
    ]
}

function patchCommentHandler( {
    entityType,
    getCommentId,
}: {
    entityType: CommentEntityType,
    getCommentId: (req: Request) => number
}) {
    return (req: Request, res: Response) => {
        
        // Validated by middleware
        const id = getCommentId(req)
        const comment = NewCommentSchema.parse(req.body)
        
        try {
            db.comments.update(entityType, id, comment.comment)
        } catch (err) {
            res.status(500).send(`Failed to update ${entityType} comment in the database`)
        }
        res.end()
    }
}


// ---- Manage the count of unread comments ---- 

router.get("/comments/unread/count", (req, res) => {
    const user = getUser(req)

    const unreadCount = db.comments.getUnreadCount(user.userId)
    const result: Count = {
        count: unreadCount ?? 0
    }

    res.send(result)
})

router.post("/comments/unread/count/reset", (req, res) => {
    const user = getUser(req)
    db.comments.resetUnreadCount(user.userId)
    res.end()
})

export {
    router as commentsApi
}

