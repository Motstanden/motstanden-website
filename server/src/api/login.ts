import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import * as passportConfig from "../config/passportConfig" 
import Database from "better-sqlite3";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig";

let router = express.Router()

router.post("/auth/magic_login", (req, res) => {
    const email = req.body.destination.trim().toLowerCase();

    // Check if email exists in the database
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT user_id as userId FROM user WHERE email = ?")
    const dbUser = stmt.get(email)
    db.close();

    if(dbUser)
    {
        passportConfig.magicLogin.send(req, res)
    }
    else {
        res.end()   // TODO: Send back spoof response so that random users cannot get information about which emails are in the database.
    }
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