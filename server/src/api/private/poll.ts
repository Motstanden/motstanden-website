import { UserGroup } from "common/enums"
import express from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router() 

router.get("/polls",
    (req, res) => {
        const pollList = db.polls.getAll()
        res.send(pollList)
    }
)

router.get("/polls/latest",
    (req, res) => {
        const poll = db.polls.getNewest()
        res.send(poll)
    }
)

router.get("/polls/:id/options",
    validateParams(Schemas.params.id),
    (req, res) => {
        const user = getUser(req)
        const { id } = Schemas.params.id.parse(req.params)

        const pollExists = db.polls.exists(id)
        if(!pollExists)
            return res.status(404).end()

        const options = db.polls.options.getAll(user.userId, id)
        res.json(options)
    }
)

router.get("/polls/:id/voter-list",
    validateParams(Schemas.params.id),
    (req, res) => { 
        const { id } = Schemas.params.id.parse(req.params)        
        
        const pollExists = db.polls.exists(id)
        if(!pollExists)
            return res.status(404).end()
        
        const voters = db.polls.votes.get(id)
        res.json(voters)
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
    validateBody(NewPollSchema),
    (req, res) => {

        // Validated by middleware
        const user = getUser(req)
        const newPoll = NewPollSchema.parse(req.body)

        if(!newPoll)
            return res.status(400).send("Could not parse poll data")

        db.polls.insert(newPoll, user.userId)
        res.end()
    }
)

router.post("/polls/delete",
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => req.body.id,
        getAuthorInfo: (id) => db.polls.get(id)
    }),
    (req, res) => {
        const id = req.body.id as number    // This is already validated by requiresGroupOrAuthor 
        db.polls.delete(id)
        res.end()
    }
)

const OptionIdSchema = z.coerce.number().int().positive().finite()
const UpsertVoteSchema = z.array(OptionIdSchema).min(1, "Body must contain at least one option id")

router.post("/polls/:id/vote/upsert",
    validateParams(Schemas.params.id),
    validateBody(UpsertVoteSchema),
    (req, res) => {
        
        const user = getUser(req)
        const { id: pollId } = Schemas.params.id.parse(req.params)
        const optionIds = UpsertVoteSchema.parse(req.body)

        if(!db.polls.options.allIdsMatchesPollId(pollId, optionIds)){
            return res.status(400).send("Invalid combination of poll id and option ids")
        }
        
        db.polls.votes.upsert(user.userId, pollId, optionIds);
        res.end()
    }
)

export {
    router as pollApi
}

