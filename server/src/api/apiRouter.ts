import express from "express";
import documents from "./documents.js";
import events from "./events.js";
import login from "./login.js";
import poll from "./poll.js";
import quotes from "./quotes.js";
import rumours from "./rumours.js";
import sheetArchive from "./sheetArchive.js";
import simpleText from "./simpleText.js";
import songLyric from "./songLyric.js";
import user from "./user.js";

const router = express.Router()

router.use(documents)
router.use(events)
router.use(login)
router.use(poll)
router.use(quotes)
router.use(rumours)
router.use(sheetArchive)
router.use(simpleText)
router.use(songLyric)
router.use(user)

export default router;