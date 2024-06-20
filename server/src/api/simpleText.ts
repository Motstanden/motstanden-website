import { UserGroup } from "common/enums"
import { UpdateSimpleText } from "common/interfaces"
import { isNullOrWhitespace, strToNumber } from "common/utils"
import express, { Request, Response } from "express"
import { db } from "../db/index.js"
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js"
import { requiresGroup } from "../middleware/requiresGroup.js"
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

router.post("/simple-text/:id/update", 
    AuthenticateUser(),
    requiresGroup(UserGroup.Editor),
    validateNumber({
        getValue: req => req.params.id,
    }),
    (req: Request, res: Response) => {
        const id = strToNumber(req.params.id) as number             // Has been validated by middleware
        const user = req.user as AccessTokenData                    // Has been validated by middleware
        const newSimpleText = tryCreateValidSimpleText(req.body)

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

function tryCreateValidSimpleText(obj: unknown) : UpdateSimpleText | undefined {
    if(typeof obj !== "object" || obj === null) {
        return undefined
    }

    const simpleText = obj as UpdateSimpleText

    if(typeof simpleText.text !== "string") {
        return undefined
    }

    return {
        text: simpleText.text
    }
}

export default router