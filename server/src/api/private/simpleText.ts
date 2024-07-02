import { UserGroup } from "common/enums"
import express, { Request, Response } from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { RequiresGroup } from "../../middleware/requiresGroup.js"
import { validateBody, validateParams } from "../../middleware/zodValidation.js"
import { getUser } from "../../utils/getUser.js"
import { Schemas } from "../../utils/zodSchema.js"

const router = express.Router();

const UpdateSimpleTextSchema = z.object({ 
    text: z.string().trim().min(1, "Text must not be empty")
})

router.patch("/simple-texts/:id", 
    validateParams(Schemas.params.id),
    RequiresGroup(UserGroup.Editor),
    validateBody(UpdateSimpleTextSchema),
    (req: Request, res: Response) => {
        const { id } = Schemas.params.id.parse(req.params)
        const user = getUser(req)
        const newSimpleText = UpdateSimpleTextSchema.parse(req.body)

        db.simpleTexts.update(newSimpleText, id, user.userId)
        res.end()
    }
)

export {
    router as privateSimpleTextApi
}

