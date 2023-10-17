import { isNullOrWhitespace } from "common/utils";
import express from "express";
import { simpleTextService } from "../services/simpleText.js";

const router = express.Router();

router.get("/simple-text/:key", (req, res) => { 
    const key = req.params.key.trim().toLowerCase()
    
    if(isNullOrWhitespace(key)) {
        return res.status(400).send("A non-empty key is required")
    }

    try {
        const text = simpleTextService.get(key)
        if(!text) {
            return res.status(404).send(`No simple text found for key: ${key}`)
        }
        res.send(text) 
    } catch (err) {
        console.error(err)
        res.status(500).send("Failed to retrieve simple text from the database")
    }
    res.end()
})

export default router