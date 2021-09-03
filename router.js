const router = require("express").Router()
const login = require("./routes/login")
const songLyric = require("./routes/songLyric")
const documents = require("./routes/documents")
const quotes = require("./routes/quotes")
const sheetArchive = require("./routes/sheetArchive")
const debugRouter = require("./routes/debug/debugRouter")

router.use(login)
router.use(songLyric)
router.use(documents)
router.use(quotes)
router.use(sheetArchive)
router.use("/debug", debugRouter)

module.exports = router;