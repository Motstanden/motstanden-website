import express from "express";
import documents from "./documents";
import events from "./events";
import login from "./login";
import quotes from "./quotes";
import rumours from "./rumours";
import sheetArchive from "./sheetArchive";
import songLyric from "./songLyric";
import user from "./user";

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