import { MagicLinkResponse, User } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import express, { Request } from "express"
import passport from "passport"
import * as passportConfig from "../config/passportConfig.js"
import { usersDb } from "../db/users/index.js"
import { AuthenticateUser, logOut, logOutAllUnits, loginUser } from "../middleware/jwtAuthenticate.js"
import { requiresDevEnv } from "../middleware/requiresDevEnv.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { getRandomInt } from "../utils/getRandomInt.js"
import { sleepAsync } from "../utils/sleepAsync.js"

const router = express.Router()

router.post("/auth/magic-link/create", async (req, res) => {

    const email = getMail(req)

    if (email && usersDb.exists(email)) {
        passportConfig.magicLogin.send(req, res)
    }
    else {
        // Send back spoof response so that random users cannot get information about which emails are in the database.
        const spoofData: MagicLinkResponse = {
            code: getRandomInt(10000, 99999).toString(),
            success: true
        }
        await sleepAsync(getRandomInt(1000, 2500))        // Simulate the time it takes to send the email
        res.json(spoofData)
    }
});

if (process.env.IS_DEV_ENV) {
    router.post("/dev/auth/login", requiresDevEnv, (req, res) => {

        const email = getMail(req)
        let user: User | undefined
        if(email && usersDb.exists(email)) { 
            user = usersDb.getByMail(email)
        }
        
        if(user){
            const token: AccessTokenData = {
                userId: user.id,
                email: user.email,
                groupId: user.groupId,
                groupName: user.groupName,
            }
            req.user = token
            loginUser(req, res)
        }
        res.end()
    })
}

function getMail(req: Request): string | undefined {
    const data: unknown = req.body.destination
    let email: string | undefined
    if(typeof data === "string" && !isNullOrWhitespace(data)) {
        email = data.trim().toLowerCase()
    }
    return email
}

export const magicLinkVerifyPath = "/auth/magic-link/verify"

router.get(
    magicLinkVerifyPath,
    passport.authenticate("magiclogin", { session: false }),
    async (req, res) => {
        loginUser(req, res)
         
        // TODO: Figure out why this is necessary. I don't have time to do it before dinner.
        await sleepAsync(2000) 
        
        res.redirect("/")
    }
)

router.post("/auth/logout", AuthenticateUser(), logOut)

router.post("/auth/logout/all-devices", AuthenticateUser(), logOutAllUnits)

router.get("/auth/current-user",
    AuthenticateUser( { failureRedirect: "/api/auth/current-user-failure" }),
    (req, res) => {
        const user = req.user as AccessTokenData
        const userData = usersDb.get(user.userId)
        if(userData) {
            res.send(userData)
        } else {
            // This should never happen.
            // If the user is authenticated, the user should be in the database.
            // TODO: Handle this case better. 
            console.error("User authenticated but not found in database.")
            res.status(404).end("User authenticated but not found in database")        
        }
    }
)

router.get("/auth/current-user-failure", (req, res) => res.status(204).end())

export default router