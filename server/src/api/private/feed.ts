import express from "express"
import { db } from "../../db/index.js"
import { validateQuery } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router()

router.get("/feed?:limit", 
    validateQuery(Schemas.queries.limit),
    (req, res) => {
        const { limit } = Schemas.queries.limit.parse(req.query) 
        const { userId } = getUser(req)
        const feed = db.feed.get({
            currentUserId: userId,
            limit: limit
        })
        res.json(feed) 
    }
)

export {
    router as feedApi
}
