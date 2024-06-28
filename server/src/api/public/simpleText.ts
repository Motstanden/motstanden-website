import { isNullOrWhitespace } from "common/utils"
import express from "express"
import { db } from "../../db/index.js"

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

export {
    router as publicSimpleTextApi
}

