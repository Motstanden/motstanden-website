import { strToNumber } from "common/utils";
import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";
import { pollService, pollVoteService } from "../services/poll.js";
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
    ValidatePollId,
    (req, res) => {
        const user = req.user as AccessTokenData
        const id = strToNumber(req.params.id) as number

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
        res.end()
    }
)

router.post("/polls/:id/vote/upsert",
    AuthenticateUser(),
    ValidatePollId,
    (req, res) => {
        
        const user = req.user as AccessTokenData
        const pollId = strToNumber(req.params.id) as number
        const optionIds = createValidNumberArray(req.body)

        if(optionIds.length <= 0)
            return res.status(400).send("Could not parse option ids")

        if(!pollVoteService.isValidCombination(pollId, optionIds)){
            return res.status(400).send("Invalid combination of poll id and option ids")
        }

        try {
            pollVoteService.upsertVotes(user.userId, pollId, optionIds);
        }
        catch (e){
            console.log(e)
            res.status(400).end()
        }
        res.end()
    }
)

function createValidNumberArray(dirtyValues: number[] | unknown | unknown[] ): number[] {
    
    const result: number[] = []
    
    if(!Array.isArray(dirtyValues) || dirtyValues.length === 0)
        return result

    for(let i = 0; i < dirtyValues.length; i++){

        const dirtyVal = dirtyValues[i]
        let newValue: number | undefined = undefined

        if(typeof dirtyVal === "string" ) {
            newValue = strToNumber(dirtyVal)
        } else if (typeof dirtyVal === "number") {
            newValue = dirtyVal            
        }   

        if(newValue !== undefined) {
            result.push(newValue)
        }
    }

    return result
}

function ValidatePollId(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = strToNumber(req.params.id)
    if(!id) {
        res.status(400).send("Could not parse poll id")
    } else {
        next()
    }
}

export default router