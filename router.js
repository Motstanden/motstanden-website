const router = require("express").Router()
const songLyric = require("./routes/songLyric")

router.use(songLyric)

module.exports = router;