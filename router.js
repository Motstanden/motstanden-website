const router = require("express").Router()
const songLyric = require("./routes/songLyric")
const documents = require("./routes/documents")
const quotes = require("./routes/quotes")

router.use(songLyric)
router.use(documents)
router.use(quotes)

module.exports = router;