import { LikeEntityType } from "common/enums"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { validateNumber } from "../../middleware/validateNumber.js"
import { validateBody } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"

const router = express.Router()

// ---- GET like emojis ----

router.get("/emojis",
    (req, res) => {
        const emojis = db.likes.emojis.getAll()
        res.json(emojis)
    }
)

// ---- GET likes ----

router.get("/event/comment/:entityId/likes", getLikesPipeline(LikeEntityType.EventComment))
router.get("/poll/comment/:entityId/likes", getLikesPipeline(LikeEntityType.PollComment))
router.get("/lyrics/comment/:entityId/likes", getLikesPipeline(LikeEntityType.SongLyricComment))
router.get("/wall-post/:entityId/likes", getLikesPipeline(LikeEntityType.WallPost))
router.get("/wall-post/comment/:entityId/likes", getLikesPipeline(LikeEntityType.WallPostComment))

function getLikesPipeline(entityType: LikeEntityType) {
    return [
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
        getLikesHandler({
            entityType: entityType,
            getEntityId: (req: Request) => strToNumber(req.params.entityId) as number   // Validated by previous middleware
        })
    ]
}


function getLikesHandler( {
    entityType, 
    getEntityId
}: {
    entityType: LikeEntityType
    getEntityId: (req: Request) => number
}) {
    return async (req: Request, res: Response) => {
        const id = getEntityId(req)
        try {
            const likes =  db.likes.getAll(entityType, id)
            res.send(likes)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to get ${entityType}/likes with id '${id}' from database`)
        }
        res.end()
    }
}

// ---- UPSERT likes ----

const NewLikeSchema = z.object({
    emojiId: z.coerce.number().int().positive().finite()
})

router.post(`/event/comment/:entityId/likes/upsert`, upsertLikePipeline(LikeEntityType.EventComment))
router.post("/poll/comment/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.PollComment))
router.post("/lyrics/comment/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.SongLyricComment))
router.post("/wall-post/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.WallPost))
router.post("/wall-post/comment/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.WallPostComment))

function upsertLikePipeline(entityType: LikeEntityType) {
    return [
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
        validateBody(NewLikeSchema),
        upsertLikeHandler({
            entityType: entityType,
            getEntityId: (req: Request) => strToNumber(req.params.entityId) as number   // Validated by previous middleware
        })
    ]
}

function upsertLikeHandler({
    entityType,
    getEntityId
}: {
    entityType: LikeEntityType
    getEntityId: (req: Request) => number
}) {
    return async (req: Request, res: Response) => {
        const user = getUser(req)
        const entityId = getEntityId(req)
        const like = NewLikeSchema.parse(req.body)

        if(!like) {
            return res.status(400).send("Failed to parse like object")
        }

        if(!db.likes.emojis.exists(like.emojiId)) {
            return res.status(400).send(`Emoji with id '${like.emojiId}' does not exist`)
        }

        try {
            db.likes.upsert(entityType, entityId, like, user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to upsert ${entityType} with id '${entityId}' from database`)
        }
        res.end()
    }
}

// ---- DELETE likes ----

router.post("/event/comment/:entityId/likes/delete", deleteLikePipeline(LikeEntityType.EventComment))
router.post("/poll/comment/:entityId/likes/delete", deleteLikePipeline(LikeEntityType.PollComment))
router.post("/lyrics/comment/:entityId/likes/delete", deleteLikePipeline(LikeEntityType.SongLyricComment))
router.post("/wall-post/:entityId/likes/delete", deleteLikePipeline(LikeEntityType.WallPost))
router.post("/wall-post/comment/:entityId/likes/delete", deleteLikePipeline(LikeEntityType.WallPostComment))

function deleteLikePipeline(entityType: LikeEntityType) {
    return [
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
        deleteLikeHandler({
            entityType: entityType,
            getEntityId: (req: Request) => strToNumber(req.params.entityId) as number   // Validated by previous middleware
        })
    ]
}

function deleteLikeHandler({
    entityType,
    getEntityId
}: {
    entityType: LikeEntityType
    getEntityId: (req: Request) => number
}) {
    return async (req: Request, res: Response) => {
        const user = getUser(req)
        const entityId = getEntityId(req)
        try {
            db.likes.delete(entityType, entityId, user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to delete ${entityType} with id '${entityId}' from database`)
        }
        res.end()
    }
}

export {
    router as likesApi
}

