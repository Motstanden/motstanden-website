import { MagicLinkResponse } from "common/interfaces";
import express from "express";
import passport from "passport";
import * as passportConfig from "../config/passportConfig";
import { AuthenticateUser, loginUser, logOut, logOutAllUnits } from "../middleware/jwtAuthenticate";
import { requiresDevEnv } from "../middleware/requiresDevEnv";
import * as userService from "../services/user";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import { getRandomInt } from "../utils/getRandomInt";
import { sleepAsync } from "../utils/sleepAsync";

const router = express.Router()

router.post("/auth/magic_login", (req, res) => {

    if (userService.userExists(req.body.destination)) {
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
    passport.authenticate("magiclogin", { session: false }),
    (req, res) => {
        loginUser(req, res)
        res.redirect("/hjem")
    });

if (process.env.IS_DEV_ENV) {
    router.post("/dev/login", requiresDevEnv, (req, res) => {

        const unsafeEmail = req.body.destination as string;
        if (!userService.userExists(unsafeEmail)) {
            res.end()
        }
        const token = userService.getAccessTokenData(req.body.destination)
        req.user = token
        loginUser(req, res)
        res.end()
    })
}

router.post("/logout", AuthenticateUser(), logOut)

router.post("/logout-all-units", AuthenticateUser(), logOutAllUnits)

router.get("/userMetaData",
    AuthenticateUser({ failureRedirect: "/api/userMetaDataFailure" }),
    (req, res) => {
        res.send(userService.getUserData(req.user as AccessTokenData))
    }
)

router.get("/userMetaDataFailure", (req, res) => res.status(204).end())

export default router