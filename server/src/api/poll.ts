import { strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { pollService } from "../services/poll.js";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js";

let router = express.Router() 

router.get("/polls/latest",
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        const poll = pollService.getLast(user.userId)
        res.send(poll)
    }
)

router.get("/polls/all",
    AuthenticateUser(),
    (req, res) => {
        const pollList = pollService.getAll()
        res.send(pollList)
    }
)

router.get("/polls/:id/options",
    AuthenticateUser(),
    (req, res) => {
        const user = req.user as AccessTokenData
        const id = strToNumber(req.params.id)

        if(!id)
            return res.status(400).send("Could not parse poll id")

        try {
            const options = pollService.getPollOptions(user.userId, id)
            res.send(options)
        }
        catch (e){
            console.log(e)
            res.status(500).end()
        }
    }
)

router.post("/polls/new",
    AuthenticateUser(),
    (req, res) => {
        // TODO...
    }
)

export default router