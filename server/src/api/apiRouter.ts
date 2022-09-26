import express from "express";
import login from "./login";
import user from "./user"
import songLyric from "./songLyric";
import documents from "./documents";
import quotes from "./quotes";
import sheetArchive from "./sheetArchive";
import events from "./events"
import rumours from "./rumours";

const router = express.Router()

router.use(login)
router.use(user)
router.use(songLyric)
router.use(documents)
router.use(quotes)
router.use(rumours)
router.use(events)
router.use(sheetArchive)

export default router;