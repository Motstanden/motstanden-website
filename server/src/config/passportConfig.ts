import dotenv from "dotenv"
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import passport, { PassportStatic } from 'passport'
import { Strategy as JWTStrategy } from 'passport-jwt'
import MagicLoginStrategy from 'passport-magic-login'
import { fromError } from "zod-validation-error"
import { MagicLinkPayloadSchema, magicLinkVerifyPath } from "../api/public/auth.js"
import { db } from "../db/index.js"
import { Mail } from "../services/mail.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { MagicLinkPayload } from "../ts/interfaces/MagicLinkPayload.js"
import { mailTemplates } from "../utils/mailTemplateBuilders.js"

// Ensure .env is loaded
dotenv.config()

// --------------------------------------------
//      jwt login strategy
// --------------------------------------------
function extractJwtFromCookie(req: Request): any | null {
    let token = null
    if (req && req.cookies) {
        token = req.cookies["AccessToken"]      // TODO: figure out what type this is
    }
    return token;
}

const jwtLogin = new JWTStrategy({
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: extractJwtFromCookie
}, (user, done) => done(null, user))


// --------------------------------------------
//      Magic login strategy
// --------------------------------------------

async function onSendMagicLinkRequest(email: string, href: string, code: string): Promise<void> {
    const url = process.env.IS_DEV_ENV === 'true' 
        ? `http://localhost:3000/${href}` 
        : `https://motstanden.no/${href}`
    const htmlStr = await mailTemplates.buildLoginHtml(url, code)

    // We are intentionally not awaiting the email to be sent, as it may take multiple minutes to complete.
    Mail.send({
        to: email,
        subject: "Logg inn på Motstanden",
        html: htmlStr
    })
}

function onVerifyLinkClick(
    payload: MagicLinkPayload,
    callback: (err?: Error | undefined, user?: Object | undefined, info?: any) => void
): void {

    const pareResult = MagicLinkPayloadSchema.safeParse(payload)
    if(pareResult.error) {
        const errorMsg = fromError(pareResult.error).toString()
        return callback(new Error(errorMsg))
    }

    const email = pareResult.data.destination
    const user = db.users.getByMail(email)
    if (!user) {
        return callback(new Error(`Failed to find a user with the email: ${email}`))
    }

    const accessToken: AccessTokenData = {
        userId: user.id,
        email: user.email,
        groupId: user.groupId,
        groupName: user.groupName,
    }

    callback( /*Error: */ undefined, accessToken)
}

export const magicLogin = new MagicLoginStrategy.default({
    secret: process.env.ACCESS_TOKEN_SECRET,
    callbackUrl: `api${magicLinkVerifyPath}`,
    sendMagicLink: onSendMagicLinkRequest,
    verify: onVerifyLinkClick,
})


/**
 * Mimics how passport-magic-login creates urls.
 * @param email Email of the user to authenticate.
 * @returns A url that a user can click to log in.
 */
//
// This function is created by reading the source code for passport-magic-login:
// https://github.com/mxstbr/passport-magic-login
//
// This is a hack, but the alternative is a big refactor.
// We'll allow this hack for now because it is not too awful.
export function buildMagicLinkFromMail(email: string): string {

    const jwtPayload = { destination: email }
    const token = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60min" })
    const href = `api${magicLinkVerifyPath}?token=${token}`

    const url = process.env.IS_DEV_ENV === 'true' 
        ? `http://localhost:3000/${href}` 
        : `https://motstanden.no/${href}`
    return url
}

// --------------------------------------------
//      Create passport
// --------------------------------------------
export function createPassport(): PassportStatic {
    passport.use(magicLogin)
    passport.use(jwtLogin)
    return passport
}
