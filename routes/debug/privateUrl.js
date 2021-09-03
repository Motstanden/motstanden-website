const router = require("express").Router()
const passport = require("passport")

router.get("/private_url",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        res.json({
            username: req.user.username,
            message: "You are logged in as: " + req.user.username
        })
})

module.exports = router