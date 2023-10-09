import express from "express";
import documents from "./documents.js";
import events from "./events.js";
import login from "./login.js";
import poll from "./poll.js";
import quotes from "./quotes.js";
import rumours from "./rumours.js";
import sheetArchive from "./sheetArchive.js";
import songLyric from "./songLyric.js";
import user from "./user.js";

const router = express.Router()

router.use(login)
router.use(user)
router.use(songLyric)
router.use(documents)
router.use(poll)
router.use(quotes)
router.use(rumours)
router.use(events)
router.use(sheetArchive)

export default router;