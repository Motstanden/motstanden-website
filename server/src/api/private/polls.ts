import { UserGroup } from "common/enums"
import express from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { requiresGroupOrAuthor } from "../../middleware/requiresGroupOrAuthor.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router() 

// ---- GET polls, options, voters ----

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

router.get("/polls/:id/voters",
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

// ---- POST polls ----

const NewPollOptionsSchema = z.object({ 
    text: z.string().trim().min(1, "Option text must not be empty")
})

const NewPollSchema = z.object({ 
    title: z.string().trim().min(1, "Title must not be empty"),
    type: z.literal("single").or(z.literal("multiple")),
    options: z.array(NewPollOptionsSchema).min(2, "Poll must have at least two options")
})

router.post("/polls",
    validateBody(NewPollSchema),
    (req, res) => {
        const user = getUser(req)
        const newPoll = NewPollSchema.parse(req.body)

        db.polls.insert(newPoll, user.userId)
        res.end()
    }
)

// ---- DELETE polls ----

router.delete("/polls/:id",
    validateParams(Schemas.params.id),
    requiresGroupOrAuthor({
        requiredGroup: UserGroup.Administrator,
        getId: (req) => Schemas.params.id.parse(req.params).id,
        getAuthorInfo: (id) => db.polls.get(id)
    }),
    (req, res) => {
        const { id } = Schemas.params.id.parse(req.params)
        db.polls.delete(id)
        res.end()
    }
)

// ---- PUT votes ----

const OptionIdSchema = z.coerce.number().int().positive().finite()

const UpsertVoteSchema = z.array(OptionIdSchema)
    .min(1, "Body must contain at least one option id")
    .superRefine((data, ctx) => {                                   // Prevent duplicate values in array     
        const set = new Set(data);
        if (set.size !== data.length) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Option id array cannot have duplicate values" });
        }
    })

router.put("/polls/:id/votes/me",
    validateParams(Schemas.params.id),
    validateBody(UpsertVoteSchema),
    (req, res) => {
        
        const user = getUser(req)
        const { id: pollId } = Schemas.params.id.parse(req.params)
        const optionIds = UpsertVoteSchema.parse(req.body)

        const poll = db.polls.getWithOptions(user.userId, pollId)

        // Check if poll exists 
        if(poll === undefined)
            return res.status(404).end()

        // Check all option ids from payload matches the actual option ids in the poll
        const expectedIds = poll.options.map(option => option.id)
        const isValidIds = optionIds.every(id => expectedIds.includes(id))
        if(!isValidIds)
            return res.status(400).send("Invalid combination of poll id and option ids")

        // Check only one vote for single choice poll
        if(poll.type === "single" && optionIds.length > 1)
            return res.status(400).send("Poll is single choice, only one option id is allowed")

        // Check if too many option ids
        if(optionIds.length > poll.options.length)
            return res.status(400).send("Too many option ids")

        db.polls.votes.upsert(user.userId, pollId, optionIds);
        res.end()
    }
)

export {
    router as pollApi
}

