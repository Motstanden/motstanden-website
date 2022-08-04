import express from "express";
import passport from "passport";

let router = express.Router()

router.post("/login", 
    passport.authenticate("local", {session: false}),
    (req, res) => {
        res.cookie("AccessToken", 
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
    res.clearCookie("AccessToken")
    res.end()
})

router.get("/userMetaData",
    passport.authenticate("jwt", { session: false, failureRedirect: "/api/userMetaDataFailure" }),
    (req, res) => res.send(req.user)
)

router.get("/userMetaDataFailure", 
    (req, res) => {
        console.log("test")
        res.json({user: null, message: "Brukeren er ikke logget inn." })
}) 





export default router