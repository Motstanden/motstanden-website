import express from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import * as passportConfig from "../config/passportConfig" 
import Database from "better-sqlite3";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import * as user from "../services/user";

let router = express.Router()

router.post("/auth/magic_login", (req, res) => {
    if(user.userExists(req.body.destination))
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
        const user = req.user as AccessTokenData
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
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

router.get("/userMetaDataFailure", (req, res) => res.status(204).end()) 

export default router