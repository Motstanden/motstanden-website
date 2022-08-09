import express, { response, Response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import * as passportConfig from "../config/passportConfig" 
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import * as userService from "../services/user";
import { requiresDevEnv } from "../middleware/requiresDevEnv";
import { MagicLinkResponse } from "common/interfaces";
import { getRandomInt } from "../utils/getRandomInt";
import { sleepAsync } from "../utils/sleepAsync";
import { AuthenticateUser } from "../middleware/jwtAuthenticate";

const router = express.Router()

function createAccessTokenCookie(user: AccessTokenData,  res: Response ): void {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s"})
    res.cookie("AccessToken", 
        token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: true, 
            maxAge: 1000 * 10  // 10m days 
    })
}

function createRefreshToken(user: AccessTokenData, res: Response): void {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" })
    res.cookie("RefreshToken", 
        token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: true, 
            maxAge: 1000 * 60 * 60 * 24 * 365  // 365 days 
    })
}

router.post("/auth/magic_login", (req, res) => {

    if(userService.userExists(req.body.destination))
    {
        passportConfig.magicLogin.send(req, res)
    }
    else {
        // Send back spoof response so that random users cannot get information about which emails are in the database.
        const spoofData: MagicLinkResponse = {
            code: getRandomInt(10000, 99999).toString(),
            success: true
        }
        sleepAsync(getRandomInt(1000, 2500))        // Simulate the time it takes to send the email
            .finally(() => res.json(spoofData))
    }
});

router.get(
    passportConfig.MagicLinkCallbackPath, 
    passport.authenticate("magiclogin", {session: false}), (req, res) => {
        const tokenData = req.user as AccessTokenData
        createAccessTokenCookie(tokenData, res)
        createRefreshToken(tokenData, res)
        res.redirect("/hjem")
});

if(process.env.IS_DEV_ENV) {
    router.post("/dev/login", requiresDevEnv, (req, res) => {

        const unsafeEmail = req.body.destination as string;
        if(!userService.userExists(unsafeEmail)) {
            res.end()
        }

        const token = userService.getTokenData(req.body.destination)
        createAccessTokenCookie(token, res)
        createRefreshToken(token, res)
        res.redirect("/hjem")
    })
}

router.post("/logout", (req, res) => {
    res.clearCookie("AccessToken")
    res.clearCookie("RefreshToken")
    res.end()
})

router.get("/userMetaData",
    AuthenticateUser({failureRedirect: "/api/userMetaDataFailure"}),
    (req, res) => {
        res.send(userService.getUserData(req.user as AccessTokenData))
    }
)

router.get("/userMetaDataFailure", (req, res) =>  {
    console.log("Redirected")
    res.status(204).end()
}) 

export default router