import express from "express";
import documents from "./documents.js";
import events from "./events.js";
import images from "./images.js";
import login from "./login.js";
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
router.use(quotes)
router.use(rumours)
router.use(events)
router.use(sheetArchive)
router.use(images)

export default router;