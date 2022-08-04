import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import * as passportConfig from "../config/passportConfig" 

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

router.post("/auth/magic_login", (req, res) => {
    const email = req.body.destination;
    console.log(`Checking if ${email} is in database`)
    passportConfig.magicLogin.send(req, res)
});

router.get(
    passportConfig.MagicLinkCallbackPath, 
    passport.authenticate("magiclogin", {session: false}), (req, res) => {
        const token = jwt.sign("MyUser", process.env.ACCESS_TOKEN_SECRET)
        res.cookie("AccessToken", 
            token, { 
                httpOnly: true, 
                secure: true, 
                sameSite: true, 
                maxAge: 1000 * 60 * 60 * 24 * 31 // 31 days 
        })
        res.redirect("/hjem")
});

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
        res.json({user: null, message: "Brukeren er ikke logget inn." })
}) 





export default router