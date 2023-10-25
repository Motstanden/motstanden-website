import express from "express";
import comments from "./comments.js";
import documents from "./documents.js";
import events from "./events.js";
import likes from "./likes.js";
import login from "./login.js";
import poll from "./poll.js";
import quotes from "./quotes.js";
import rumours from "./rumours.js";
import sheetArchive from "./sheetArchive.js";
import simpleText from "./simpleText.js";
import songLyric from "./songLyric.js";
import user from "./user.js";
import wallPosts from "./wallPosts.js";

const router = express.Router()

router.use(comments)
router.use(documents)
router.use(events)
router.use(likes)
router.use(login)
router.use(poll)
router.use(quotes)
router.use(rumours)
router.use(sheetArchive)
router.use(simpleText)
router.use(songLyric)
router.use(user)
router.use(wallPosts)

export default router;