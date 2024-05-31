import { CommentEntityType } from "common/enums";
import { isNullOrWhitespace, strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { commentsService } from "../services/comments.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";
import { NewComment } from "common/interfaces";

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

export default router;