import { CommentEntityType, UserGroup } from "common/enums";
import { Count, NewComment } from "common/interfaces";
import { isNullOrWhitespace, strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { commentsService } from "../services/comments.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

const router = express.Router()

// ---- GET all comments ----

router.get("/comments/all?:limit", 
    AuthenticateUser(),
    validateNumber({
        getValue: (req: Request) =>  req.query.limit?.toString() ?? ""
    }),
    (req, res) => {
        const limit = strToNumber(req.query.limit?.toString()) as number
        res.send(commentsService.getAllUnion(limit))
    }
)

// ---- GET comments ----

router.get("/event/:entityId/comments",getCommentsPipeline(CommentEntityType.Event))
router.get("/poll/:entityId/comments", getCommentsPipeline(CommentEntityType.Poll))
router.get("/song-lyric/:entityId/comments", getCommentsPipeline(CommentEntityType.SongLyric))
router.get("/wall-post/:entityId/comments", getCommentsPipeline(CommentEntityType.WallPost))

function getCommentsPipeline(entityType: CommentEntityType) {
    return [
        AuthenticateUser(),
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
        getCommentsHandler({
            entityType: entityType,
            getEntityId: (req: Request) => strToNumber(req.params.entityId) as number
        })
    ]
}

function getCommentsHandler( {
    entityType,
    getEntityId
}: {
    entityType: CommentEntityType,
    getEntityId: (req: Request) => number
}) {
    return (req: Request, res: Response) => {
        const id = getEntityId(req)
        try {
            const comments = commentsService.getAll(entityType, id)
            res.send(comments)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to get ${entityType} comments from the database`)
        }
        res.end()
    }
}

// ---- POST comments ----

router.post("/event/:entityId/comments/new", postCommentPipeline(CommentEntityType.Event))
router.post("/poll/:entityId/comments/new", postCommentPipeline(CommentEntityType.Poll))
router.post("/song-lyric/:entityId/comments/new", postCommentPipeline(CommentEntityType.SongLyric))
router.post("/wall-post/:entityId/comments/new", postCommentPipeline(CommentEntityType.WallPost))

function postCommentPipeline(entityType: CommentEntityType) { 
    return [
        AuthenticateUser(),
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
        postCommentHandler({
            entityType: entityType,
            getEntityId: (req: Request) => strToNumber(req.params.entityId) as number
        })
    ]
}

function postCommentHandler( {
    entityType,
    getEntityId
}: {
    entityType: CommentEntityType,
    getEntityId: (req: Request) => number
}) {
    return (req: Request, res: Response) => {
        const user = req.user as AccessTokenData
        const comment = tryCreateValidComment(req.body)
        const entityId = getEntityId(req)

        if(!comment)
            return res.status(400).send("Could not parse comment data")

        try {
            commentsService.insertNew(entityType, entityId, comment, user.userId)
            commentsService.incrementUnreadCount(user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to insert ${entityType} comment into the database`)
        }

        res.end()
    }
}

function tryCreateValidComment(obj: unknown): NewComment | undefined {
    if (typeof obj !== "object" || obj === null) {
        return undefined
    }

    const comment = obj as NewComment
    if (typeof comment.comment !== "string" || isNullOrWhitespace(comment.comment)) {
        return undefined
    }

    return {
        comment: comment.comment.trim()
    }
}

// ---- DELETE comment ----

router.delete("/event/:entityId/comments/:commentId", deleteCommentPipeline(CommentEntityType.Event))
router.delete("/poll/:entityId/comments/:commentId", deleteCommentPipeline(CommentEntityType.Poll))
router.delete("/song-lyric/:entityId/comments/:commentId", deleteCommentPipeline(CommentEntityType.SongLyric))
router.delete("/wall-post/:entityId/comments/:commentId", deleteCommentPipeline(CommentEntityType.WallPost))

function deleteCommentPipeline(entityType: CommentEntityType) { 
    return [
        AuthenticateUser(),
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
        requiresGroupOrAuthor({
            requiredGroup: UserGroup.Administrator,
            getId: (req) => strToNumber(req.params.commentId),
            getAuthorInfo: (id) => commentsService.get(entityType, id)
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
        console.log("Entered delete comment handler")
        const id = getCommentId(req)
        try {
            commentsService.delete(entityType, id)
        } catch (err) {
            res.status(500).send(`Failed to delete ${entityType} comment from the database`)
        }
        res.end()
    }
}

// ---- Manage the count of unread comments ---- 

router.get("/comments/unread/count", 
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData

        const unreadCount = commentsService.getUnreadCount(user.userId)
        if(unreadCount === undefined) {
            commentsService.resetUnreadCount(user.userId)
        }
        const result: Count = {
            count: unreadCount ?? 0
        }
        res.send(result)
    }
)

router.post("/comments/unread/count/reset", 
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        commentsService.resetUnreadCount(user.userId)
        res.end()
    }
)

export default router;