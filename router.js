const router = require("express").Router()
const songLyric = require("./routes/songLyric")
const documents = require("./routes/documents")
const quotes = require("./routes/quotes")
const debugRouter = require("./routes/debug/debugRouter")

router.use(songLyric)
router.use(documents)
router.use(quotes)
router.use("/debug", debugRouter)

module.exports = router;