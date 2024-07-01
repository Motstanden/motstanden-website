import { LikeEntityType } from "common/enums"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

// ---- GET like emojis ----

router.get("/emojis",
    (req, res) => {
        const emojis = db.likes.emojis.getAll()
        res.json(emojis)
    }
)

// ---- Param Schemas ----

const EntityIdSchema = z.object({ 
    entityId: Schemas.z.stringToInt()
})

// ---- GET likes ----

router.get("/events/comments/:entityId/likes", getLikesPipeline(LikeEntityType.EventComment))
router.get("/polls/comments/:entityId/likes", getLikesPipeline(LikeEntityType.PollComment))
router.get("/lyrics/comments/:entityId/likes", getLikesPipeline(LikeEntityType.SongLyricComment))
router.get("/wall-posts/:entityId/likes", getLikesPipeline(LikeEntityType.WallPost))
router.get("/wall-posts/comments/:entityId/likes", getLikesPipeline(LikeEntityType.WallPostComment))

function getLikesPipeline(entityType: LikeEntityType) {
    return [
        validateParams(EntityIdSchema),
        getLikesHandler(entityType)
    ]
}

function getLikesHandler(entityType: LikeEntityType) {
    return async (req: Request, res: Response) => {
        const { entityId } = EntityIdSchema.parse(req.params)

        const likes =  db.likes.getAll(entityType, entityId)
        res.json(likes)
    }
}

// ---- UPSERT likes ----

const NewLikeSchema = z.object({
    emojiId: z.coerce.number().int().positive().finite()
})

router.put(`/events/comments/:entityId/likes/me`, upsertLikePipeline(LikeEntityType.EventComment))
router.put("/polls/comments/:entityId/likes/me", upsertLikePipeline(LikeEntityType.PollComment))
router.put("/lyrics/comments/:entityId/likes/me", upsertLikePipeline(LikeEntityType.SongLyricComment))
router.put("/wall-posts/:entityId/likes/me", upsertLikePipeline(LikeEntityType.WallPost))
router.put("/wall-posts/comments/:entityId/likes/me", upsertLikePipeline(LikeEntityType.WallPostComment))

function upsertLikePipeline(entityType: LikeEntityType) {
    return [
        validateParams(EntityIdSchema),
        validateBody(NewLikeSchema),
        upsertLikeHandler(entityType)
    ]
}

function upsertLikeHandler(entityType: LikeEntityType) {
    return async (req: Request, res: Response) => {
        const user = getUser(req)
        const { entityId } = EntityIdSchema.parse(req.params)
        const like = NewLikeSchema.parse(req.body)

        if(!db.likes.emojis.exists(like.emojiId)) {
            return res.status(400).send(`Emoji with id '${like.emojiId}' does not exist`)
        }

        db.likes.upsert(entityType, entityId, like, user.userId)
        res.end()
    }
}

// ---- DELETE likes ----

router.delete("/events/comments/:entityId/likes/me", deleteLikePipeline(LikeEntityType.EventComment))
router.delete("/polls/comments/:entityId/likes/me", deleteLikePipeline(LikeEntityType.PollComment))
router.delete("/lyrics/comments/:entityId/likes/me", deleteLikePipeline(LikeEntityType.SongLyricComment))
router.delete("/wall-posts/:entityId/likes/me", deleteLikePipeline(LikeEntityType.WallPost))
router.delete("/wall-posts/comments/:entityId/likes/me", deleteLikePipeline(LikeEntityType.WallPostComment))

function deleteLikePipeline(entityType: LikeEntityType) {
    return [
        validateParams(EntityIdSchema),
        deleteLikeHandler(entityType)
    ]
}

function deleteLikeHandler(entityType: LikeEntityType) {
    return async (req: Request, res: Response) => {
        const user = getUser(req)
        const { entityId } = EntityIdSchema.parse(req.params)

        db.likes.delete(entityType, entityId, user.userId)
        res.end()
    }
}

export {
    router as likesApi
}

