import { LikeEntityType } from "common/enums";
import { strToNumber } from "common/utils";
import express, { Request, Response } from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { validateNumber } from "../middleware/validateNumber.js";
import { likesService } from "../services/likes.js";

const router = express.Router()

router.get(`event/comment/:entityId/likes`, getLikesPipeline(LikeEntityType.EventComment))
router.get("poll/comment/:entityId/likes", getLikesPipeline(LikeEntityType.PollComment))
router.get("song-lyric/comment/:entityId/likes", getLikesPipeline(LikeEntityType.SongLyricComment))
router.get("wall-post/:entityId/likes", getLikesPipeline(LikeEntityType.WallPost))
router.get("wall-post/comment/:entityId/likes", getLikesPipeline(LikeEntityType.WallPostComment))

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

export default router