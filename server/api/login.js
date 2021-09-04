const router = require("express").Router()
const passport = require("passport")
const ACCESSTOKEN = "AccessToken"

router.post("/login", 
    passport.authenticate("local", {session: false}),
    (req, res) => {
        res.cookie(ACCESSTOKEN, 
            req.user.accessToken, { 
                httpOnly: true, 
                secure: true, 
                sameSite: true, 
                maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days 
        })
        res.json({
            message: "Du er logget inn som " + req.user.username
        })
})

router.post("/logout", (req, res) => {
    res.clearCookie(ACCESSTOKEN)
    res.end()
})

module.exports = router