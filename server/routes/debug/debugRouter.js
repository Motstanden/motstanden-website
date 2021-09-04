const router = require("express").Router()
const ping = require("./ping")
const privateUrl = require("./privateUrl")

router.use(ping)
router.use(privateUrl)

module.exports = router