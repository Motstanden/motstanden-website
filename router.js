const router = require("express").Router()
const songLyric = require("./routes/songLyric")
const documents = require("./routes/documents")

router.use(songLyric)
router.use(documents)

module.exports = router;