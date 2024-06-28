import { MagicLinkResponse, User } from "common/interfaces"
import express from "express"
import passport from "passport"
import { z } from "zod"
import * as passportConfig from "../../config/passportConfig.js"
import { db } from "../../db/index.js"
import { AuthenticateUser, logOut, logOutAllUnits, loginUser } from "../../middleware/jwtAuthenticate.js"
import { requiresDevEnv } from "../../middleware/requiresDevEnv.js"
import { validateBody } from "../../middleware/zodValidation.js"
import { AccessTokenData } from "../../ts/interfaces/AccessTokenData.js"
import { getRandomInt } from "../../utils/getRandomInt.js"
import { sleepAsync } from "../../utils/sleepAsync.js"

const router = express.Router()

export const MagicLinkPayloadSchema = z.object({
    destination: z.string().trim().toLowerCase().email()
})

router.post("/auth/magic-link/create", 
    validateBody(MagicLinkPayloadSchema),
    async (req, res) => {
        
        // Validated by middleware
        const { destination: email } = MagicLinkPayloadSchema.parse(req.body)

        if (email && db.users.exists(email)) {
            passportConfig.magicLogin.send(req, res)
        } else {
            // Send back spoof response so that random users cannot get information about which emails are in the database.
            const spoofData: MagicLinkResponse = {
                code: getRandomInt(10000, 99999).toString(),
                success: true
            }
            await sleepAsync(getRandomInt(1000, 2500))        // Simulate the time it takes to send the email
            res.json(spoofData)
        }
    }
);

if (process.env.IS_DEV_ENV) {
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

router.post("/auth/logout", AuthenticateUser(), logOut)

router.post("/auth/logout/all-devices", AuthenticateUser(), logOutAllUnits)

export {
    router as authApi
}
