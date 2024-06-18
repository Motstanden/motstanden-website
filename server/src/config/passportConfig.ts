import dotenv from "dotenv";
import { Request } from 'express';
import fs from "fs/promises";
import passport, { PassportStatic } from 'passport';
import { Strategy as JWTStrategy } from 'passport-jwt';
import MagicLoginStrategy from 'passport-magic-login';
import { magicLinkVerifyPath } from "../api/auth.js";
import * as user from "../db/user.js";
import { MagicLinkPayload } from "../ts/interfaces/MagicLinkPayload.js";
import * as Mail from './mailConfig.js';

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
const DomainUrl = process.env.IS_DEV_ENV === 'true' ? 'http://localhost:3000' : 'https://motstanden.no'

async function onSendMagicLinkRequest(email: string, href: string, code: string): Promise<void> {
    const htmlStr = await createMagicLinkHtml(href, code)
    await Mail.transporter.sendMail({
        from: {
            name: "Motstanden",
            address: Mail.InfoMail
        },
        to: email,
        subject: "Logg inn på Motstanden",
        html: htmlStr
    })
}

async function createMagicLinkHtml(href: string, code: string) {

    const filePath = new URL(`../../assets/mail-templates/MagicLink.html`, import.meta.url)
    const html = await fs.readFile(filePath, "utf-8")

    const date = new Date().toLocaleString("no-no", { timeZone: "cet" })

    return html.replace("${magiclink}", `${DomainUrl}/${href}`)
        .replace("${verificationcode}", code)
        .replace("${timestamp}", `${date}`)
}

function onVerifyLinkClick(
    payload: MagicLinkPayload,
    callback: (err?: Error | undefined, user?: Object | undefined, info?: any) => void
): void {
    const accessTokenData = user.getAccessTokenData(payload.destination)
    callback( /*Error*/ undefined, accessTokenData)
}

export const magicLogin = new MagicLoginStrategy.default({
    secret: process.env.ACCESS_TOKEN_SECRET,
    callbackUrl: `api${magicLinkVerifyPath}`,
    sendMagicLink: onSendMagicLinkRequest,
    verify: onVerifyLinkClick,
})

// --------------------------------------------
//      Create passport
// --------------------------------------------
export function createPassport(): PassportStatic {
    passport.use(magicLogin)
    passport.use(jwtLogin)
    return passport
}
