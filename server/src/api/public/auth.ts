import { MagicLinkResponse, User } from "common/interfaces"
import { randomInt } from "crypto"
import express from "express"
import passport from "passport"
import { z } from "zod"
import * as passportConfig from "../../config/passportConfig.js"
import { db } from "../../db/index.js"
import { AuthenticateUser, logOut, logOutAllUnits, loginUser } from "../../middleware/jwtAuthenticate.js"
import { requiresDevEnv } from "../../middleware/requiresDevEnv.js"
import { validateBody } from "../../middleware/zodValidation.js"
import { AccessTokenData } from "../../ts/interfaces/AccessTokenData.js"
import { sleepAsync } from "../../utils/sleepAsync.js"

const router = express.Router()

export const MagicLinkPayloadSchema = z.object({
    destination: z.string().trim().toLowerCase().email()
})

router.post("/auth/magic-link", 
    validateBody(MagicLinkPayloadSchema),
    async (req, res) => {
        // TODO: 
        // This api is vulnerable to timing attacks.
        // A motivated attacker could use this api to determine which emails are in the database.
        // https://github.com/Motstanden/motstanden-website/issues/98

        // A random delay to make timing attacks less feasible.
        // Although, it is important to note that this does not fully prevent timing attacks:
        // https://security.stackexchange.com/questions/96489/can-i-prevent-timing-attacks-with-random-delays  
        await sleepAsync(randomInt(0, 15 * 1000))

        const { destination: email } = MagicLinkPayloadSchema.parse(req.body)

        if (email && db.users.exists(email)) {
            passportConfig.magicLogin.send(req, res)
        } else {
            // Send back spoof response so that random users cannot *easily* get information about which emails are in the database.
            const spoofData: MagicLinkResponse = {
                code: randomInt(10000, 99999).toString(),
                success: true
            }
            res.json(spoofData)
        }
    }
)

if (process.env.IS_DEV_ENV === "true") {
    router.post("/dev/auth/login", 
        requiresDevEnv,
        validateBody(MagicLinkPayloadSchema), 
        (req, res) => {

            // Validated by middleware
            const { destination: email } = MagicLinkPayloadSchema.parse(req.body)

            let user: User | undefined
            if(email && db.users.exists(email)) { 
                user = db.users.getByMail(email)
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
        }
    )
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

router.post("/auth/logout", 
    AuthenticateUser(), 
    (req, res) => {
        logOut(req, res)
        res.end()
    }
)

router.post("/auth/logout/all-devices", 
    AuthenticateUser(),
    (req, res) => {
        logOutAllUnits(req, res)
        res.end()
    } 
)

export {
    router as authApi
}

