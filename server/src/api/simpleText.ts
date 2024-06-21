import { UserGroup } from "common/enums"
import { isNullOrWhitespace, strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroup } from "../middleware/requiresGroup.js"
import { validateBody } from "../middleware/validateBody.js"
import { validateNumber } from "../middleware/validateNumber.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"

const router = express.Router();

router.get("/simple-text/:key", (req, res) => { 
    const key = req.params.key.trim().toLowerCase()
    
    if(isNullOrWhitespace(key)) {
        return res.status(400).send("A non-empty key is required")
    }

    try {
        const text = db.simpleTexts.get(key)
        if(text === undefined) {
            return res.status(404).send(`No simple text found for key: ${key}`)
        }
        res.send(text) 
    } catch (err) {
        console.error(err)
        res.status(500).send("Failed to retrieve simple text from the database")
    }
    res.end()
})

const UpdateSimpleTextSchema = z.object({ 
    text: z.string().trim().min(1, "Text must not be empty")
})

router.post("/simple-text/:id/update", 
    validateNumber({
        getValue: req => req.params.id,
    }),
    AuthenticateUser(),
    requiresGroup(UserGroup.Editor),
    validateBody(UpdateSimpleTextSchema),
    (req: Request, res: Response) => {

        // Validated by middleware
        const id = strToNumber(req.params.id) as number
        const user = req.user as AccessTokenData
        const newSimpleText = UpdateSimpleTextSchema.parse(req.body)

        if(!newSimpleText)
            return res.status(400).send("Invalid data for UpdateSimpleText object")

        try {
            db.simpleTexts.update(newSimpleText, id, user.userId)
        } catch (err) {
            console.error(err)
            return res.status(500).send("Failed to update simple text in the database")
        }
        res.end()
    }
)

export default router