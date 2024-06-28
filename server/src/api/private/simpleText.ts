import { UserGroup } from "common/enums"
import { strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { RequiresGroup } from "../../middleware/requiresGroup.js"
import { validateNumber } from "../../middleware/validateNumber.js"
import { validateBody } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"

const router = express.Router();

const UpdateSimpleTextSchema = z.object({ 
    text: z.string().trim().min(1, "Text must not be empty")
})

router.post("/simple-text/:id/update", 
    validateNumber({
        getValue: req => req.params.id,
    }),
    RequiresGroup(UserGroup.Editor),
    validateBody(UpdateSimpleTextSchema),
    (req: Request, res: Response) => {

        // Validated by middleware
        const id = strToNumber(req.params.id) as number
        const user = getUser(req)
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

export {
    router as privateSimpleTextApi
}

