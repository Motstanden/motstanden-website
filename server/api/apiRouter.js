const router = require("express").Router()
const login = require("./login")
const songLyric = require("./songLyric")
const documents = require("./documents")
const quotes = require("./quotes")
const sheetArchive = require("./sheetArchive")
const debugRouter = require("./debug/debugRouter")

router.use(login)
router.use(songLyric)
router.use(documents)
router.use(quotes)
router.use(sheetArchive)
router.use("/debug", debugRouter)

module.exports = router;