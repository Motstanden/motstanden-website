import { LikeEntityType } from "common/enums";
import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { emojiService, likesService } from "../services/likes.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";
import { NewLike } from "common/interfaces";

const router = express.Router()

// ---- GET like emojis ----

router.get("/likes/emojis/all",
    AuthenticateUser(),
    (req, res) => {
        const emojis = emojiService.getAll()
        res.send(emojis)
    }
)

// ---- GET likes ----

router.get("/event/comment/:entityId/likes", getLikesPipeline(LikeEntityType.EventComment))
router.get("/poll/comment/:entityId/likes", getLikesPipeline(LikeEntityType.PollComment))
router.get("/song-lyric/comment/:entityId/likes", getLikesPipeline(LikeEntityType.SongLyricComment))
router.get("/wall-post/:entityId/likes", getLikesPipeline(LikeEntityType.WallPost))
router.get("/wall-post/comment/:entityId/likes", getLikesPipeline(LikeEntityType.WallPostComment))

function getLikesPipeline(entityType: LikeEntityType) {
    return [
        AuthenticateUser(),
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
            const likes =  likesService.getAll(entityType, id)
            res.send(likes)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to get ${entityType}/likes with id '${id}' from database`)
        }
        res.end()
    }
}

// ---- UPSERT likes ----

router.post(`/event/comment/:entityId/likes/upsert`, upsertLikePipeline(LikeEntityType.EventComment))
router.post("/poll/comment/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.PollComment))
router.post("/song-lyric/comment/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.SongLyricComment))
router.post("/wall-post/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.WallPost))
router.post("/wall-post/comment/:entityId/likes/upsert", upsertLikePipeline(LikeEntityType.WallPostComment))

function upsertLikePipeline(entityType: LikeEntityType) {
    return [
        AuthenticateUser(),
        validateNumber({
            getValue: (req: Request) => req.params.entityId,
        }),
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
        const user = req.user as AccessTokenData
        const entityId = getEntityId(req)
        const like = tryCreateValidLike(req.body)

        if(!like) {
            return res.status(400).send("Failed to parse like object")
        }

        if(!emojiService.exists(like.emojiId)) {
            return res.status(400).send(`Emoji with id '${like.emojiId}' does not exist`)
        }

        try {
            likesService.upsert(entityType, entityId, like, user.userId)
        } catch (err) {
            console.error(err)
            res.status(500).send(`Failed to upsert ${entityType} with id '${entityId}' from database`)
        }
        res.end()
    }
}

function tryCreateValidLike(obj: unknown ): NewLike | undefined {
    
    if(typeof obj !== "object" || obj === null)
        return undefined

    const like = obj as NewLike

    if(typeof like.emojiId !== "number" || like.emojiId < 0)
        return undefined
    
    return {
        emojiId: like.emojiId
    }
}

export default router