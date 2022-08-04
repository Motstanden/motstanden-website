import express from "express";
import passport from "passport";

let router = express.Router()

router.get("/private_url",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        res.json({
            username: req.user.username,
            message: "You are logged in as: " + req.user.username
        })
})

export default router