import dotenv from "dotenv";
import * as Mail from './mailConfig.js';
import MagicLoginStrategy from 'passport-magic-login';
import passport, { PassportStatic } from 'passport';
import { Request } from 'express';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { MagicLinkPayload } from "../ts/interfaces/MagicLinkPayload";
import * as user from "../services/user.js";
import path from "path";
import fs from "fs/promises";

// Ensure .env is loaded
dotenv.config()

// --------------------------------------------
//      jwt login strategy
// --------------------------------------------
function extractJwtFromCookie(req: Request): any | null {
    let token = null
    if(req && req.cookies){
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

export const MagicLinkCallbackPath = "/auth/magic_login/callback"

async function onSendMagicLinkRequest(email: string, href: string, code: string): Promise<void> {
    const htmlStr = await createMagicLinkHtml(email, href, code)
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

async function createMagicLinkHtml(email: string, href: string, code: string) {
    
    const filePath = path.join(__dirname, "..", "..", "assets", "mail-templates", "MagicLink.html")
    const html = await fs.readFile(filePath, "utf-8")
    
    const date = new Date().toLocaleString("no-no", { timeZone: "cet"})

    return html.replace("${magiclink}", `${DomainUrl}/${href}`)
               .replace("${verificationcode}", code)
               .replace("${timestamp}", `${date}` )
}

function onVerifyLinkClick(
    payload: MagicLinkPayload, 
    callback: (err?: Error | undefined, user?: Object | undefined, info?: any) => void
): void {
    // TODO:
    //      - Ensure that the link is only allowed to be clicked exactly once
    //      - Retrieve user information and send it further
    const accessTokenData = user.getTokenData(payload.destination)
    callback( /*Error*/ undefined, accessTokenData)
}

export const magicLogin = new MagicLoginStrategy({
    secret: process.env.ACCESS_TOKEN_SECRET,
    callbackUrl: `api${MagicLinkCallbackPath}`,
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
