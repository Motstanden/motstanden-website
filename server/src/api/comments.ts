import express, {Request, Response}from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { CommentEntityType } from "common/enums";

const router = express.Router()

router.get("event/:entityId/comments",
    AuthenticateUser(),
    getCommentsHandler({
        entity: CommentEntityType.Event
    })
)

router.get("poll/:entityId/comments",
    AuthenticateUser(),
    getCommentsHandler({
        entity: CommentEntityType.Poll
    })
)

function getCommentsHandler( {entity}: {entity: CommentEntityType}) {
    return (req: Request, res: Response) => {
        // TODO

        console.log("Getting comments for entity: ", entity, " with id: ", req.params.entityId)

        throw "Not implemented yet"
    }
}


router.post("event/:entityId/comments",
    AuthenticateUser(),
    postCommentHandler({
        entity: CommentEntityType.Event
    })
)

router.post("poll/:entityId/comments", 
    AuthenticateUser(),
    postCommentHandler({
        entity: CommentEntityType.Poll
    })
)

function postCommentHandler( {entity}: {entity: CommentEntityType}) {
    return (req: Request, res: Response) => {
        // TODO

        console.log("Inserting comments for entity: ", entity, " with id: ", req.params.entityId)

        throw "Not implemented yet"
    }
}

export default router;