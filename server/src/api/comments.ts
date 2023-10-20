import express, {Request, Response}from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { CommentEntityType } from "common/enums";
import { validateNumber } from "../middleware/validateNumber.js";
import { strToNumber } from "common/utils";

const router = express.Router()

router.get("/event/:entityId/comments",
    AuthenticateUser(),
    validateNumber({
        getValue: (req: Request) => req.params.entityId,
    }),
    getCommentsHandler({
        entityType: CommentEntityType.Event,
        getEntityId: (req: Request) => strToNumber(req.params.entityId) as number
    })
)

router.get("/poll/:entityId/comments",
    AuthenticateUser(),
    validateNumber({
        getValue: (req: Request) => req.params.entityId,
    }),
    getCommentsHandler({
        entityType: CommentEntityType.Poll,
        getEntityId: (req: Request) => strToNumber(req.params.entityId) as number
    })
)

function getCommentsHandler( {
    entityType,
    getEntityId
}: {
    entityType: CommentEntityType,
    getEntityId: (req: Request) => number
}) {
    return (req: Request, res: Response) => {
        // TODO
        
    }
}

router.post("/event/:entityId/comments",
    AuthenticateUser(),
    validateNumber({
        getValue: (req: Request) => req.params.entityId,
    }),
    postCommentHandler({
        entityType: CommentEntityType.Event,
        getEntityId: (req: Request) => strToNumber(req.params.entityId) as number
    })
)

router.post("/poll/:entityId/comments", 
    AuthenticateUser(),
    validateNumber({
        getValue: (req: Request) => req.params.entityId,
    }),
    postCommentHandler({
        entityType: CommentEntityType.Poll,
        getEntityId: (req: Request) => strToNumber(req.params.entityId) as number
    })
)

function postCommentHandler( {
    entityType,
    getEntityId
}: {
    entityType: CommentEntityType,
    getEntityId: (req: Request) => number
}) {
    return (req: Request, res: Response) => {
        // TODO

        console.log("Inserting comments for entity: ", entityType, " with id: ", req.params.entityId)

        throw "Not implemented yet"
    }
}

export default router;