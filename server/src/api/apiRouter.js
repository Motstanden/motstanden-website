import express from "express";
import login from "./login.js";
import songLyric from "./songLyric.js";
import documents from "./documents.js";
import quotes from "./quotes.js";
import sheetArchive from "./sheetArchive.js";
import debugRouter from "./debug/debugRouter.js";

let router = express.Router()

router.use(login)
router.use(songLyric)
router.use(documents)
router.use(quotes)
router.use(sheetArchive)
router.use("/debug", debugRouter)

export default router;