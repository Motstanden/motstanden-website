import express from "express"
import { z } from "zod"
import { db } from "../../db/index.js"
import { validateParams } from "../../middleware/zodValidation.js"

const router = express.Router();

const SimpleTextParamsSchema = z.object({
    key: z.string().trim().toLowerCase().min(1, "Key must not be empty")
})

router.get("/simple-texts/:key", 
    validateParams(SimpleTextParamsSchema),
    (req, res) => { 
        const { key } = SimpleTextParamsSchema.parse(req.params)
    
        const text = db.simpleTexts.get(key)
        if(text !== undefined) {
            res.json(text)
        } else {
            res.status(404).send(`No simple text found for key: ${key}`)
        }
})

export {
    router as publicSimpleTextApi
}

