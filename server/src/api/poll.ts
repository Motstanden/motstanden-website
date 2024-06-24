import { UserGroup } from "common/enums"
import { strToNumber } from "common/utils"
import express from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroupOrAuthor } from "../middleware/requiresGroupOrAuthor.js"
import { validateNumber } from "../middleware/validateNumber.js"
import { validateBody } from "../middleware/zodValidation.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"

const router = express.Router() 

router.get("/polls/latest",
    AuthenticateUser(),
    (req, res) => {
        const poll = db.polls.getNewest()
        res.send(poll)
    }
)

router.get("/polls/all",
    AuthenticateUser(),
    (req, res) => {
        const pollList = db.polls.getAll()
        res.send(pollList)
    }
)

router.get("/polls/:id/options",
    AuthenticateUser(),
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse poll id"
    }),
    (req, res) => {
        const user = req.user as AccessTokenData
        const id = strToNumber(req.params.id) as number

        const isValid = db.polls.exists(id)
        if(!isValid)
            return res.status(404).end()

        try {
            const options = db.polls.options.getAll(user.userId, id)
            res.send(options)
        }
        catch (e){
            console.log(e)
            res.status(500).end()
        }
    }
)

router.get("/polls/:id/voter-list",
    AuthenticateUser(),
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse poll id"
    }),
    (req, res) => { 
        const pollId = strToNumber(req.params.id) as number
        
        try {
            const voters = db.polls.votes.get(pollId)
            res.send(voters)
        }
        catch (e){
            console.error(e)
            res.status(500).end()
        }
        res.end()
    }
)

const NewPollOptionsSchema = z.object({ 
    text: z.string().trim().min(1, "Option text must not be empty")
})

const NewPollSchema = z.object({ 
    title: z.string().trim().min(1, "Title must not be empty"),
    type: z.literal("single").or(z.literal("multiple")),
    options: z.array(NewPollOptionsSchema).min(2, "Poll must have at least two options")
})

router.post("/polls/new",
    AuthenticateUser(),
    validateBody(NewPollSchema),
    (req, res) => {

        // Validated by middleware
        const user = req.user as AccessTokenData
        const newPoll = NewPollSchema.parse(req.body)

        if(!newPoll)
            return res.status(400).send("Could not parse poll data")

        try {
            db.polls.insert(newPoll, user.userId)
        } catch (err) {
            console.log(err)
            res.status(500).send("Failed to insert poll into database")
        }
        res.end()
    }
)

router.post("/polls/delete",
    AuthenticateUser(),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: (id) => db.polls.get(id)
    }),
    (req, res) => {
        const id = req.body.id as number    // This is already validated by requiresGroupOrAuthor 
        try {
            db.polls.delete(id)
        } catch (err) {
            res.status(500).send("Failed to delete poll from database")
        }
        res.end()
    }
)

const OptionIdSchema = z.coerce.number().int().positive().finite()
const UpsertVoteSchema = z.array(OptionIdSchema).min(1, "Body must contain at least one option id")

router.post("/polls/:id/vote/upsert",
    validateNumber({
        getValue: (req) => req.params.id,
        failureMessage: "Could not parse poll id"
    }),
    AuthenticateUser(),
    validateBody(UpsertVoteSchema),
    (req, res) => {
        
        const user = req.user as AccessTokenData
        const pollId = strToNumber(req.params.id) as number
        const optionIds = UpsertVoteSchema.parse(req.body)

        if(!db.polls.options.allIdsMatchesPollId(pollId, optionIds)){
            return res.status(400).send("Invalid combination of poll id and option ids")
        }

        try {
            db.polls.votes.upsert(user.userId, pollId, optionIds);
        }
        catch (e){
            console.log(e)
            res.status(400).end()
        }
        res.end()
    }
)

export default router