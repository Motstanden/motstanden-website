import dotenv from "dotenv";
import * as Mail from './mailConfig.js';
import MagicLoginStrategy from 'passport-magic-login';
import passport, { PassportStatic } from 'passport';
import { Request } from 'express';
import { Strategy as JWTStrategy } from 'passport-jwt';

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
}, (username, done) => {
    const user = {
        username: username,
        id: null
    }
    return done(null, user)
}) 


// --------------------------------------------
//      Magic login strategy
// --------------------------------------------
const DomainUrl = process.env.IS_DEV_ENV === 'true' ? 'http://localhost:3000' : 'https://motstanden.no'

export const MagicLinkCallbackPath = "/auth/magic_login/callback"

async function onSendMagicLinkRequest(email: string, href: string): Promise<void> {
    await Mail.transporter.sendMail({
        from: Mail.InfoMail,
        to: email,
        subject: "Logg inn på Motstanden",
        text: `Klikk på denne linken for å logge deg inn på Motstanden.no på denne enheten: ${DomainUrl}/${href}`
    })
    console.log("Mail sent")
}

export const magicLogin = new MagicLoginStrategy({
    secret: process.env.ACCESS_TOKEN_SECRET,
    callbackUrl: `api/${MagicLinkCallbackPath}`,
    sendMagicLink: onSendMagicLinkRequest,

    // This is called right after the user clicks the link in the mail.
    // Passport requires this to be defined.
    // We don't need to do anything here, so lets just forward the user to the callback url.
    verify: (payload, callback) => callback(undefined, payload),     
})


// --------------------------------------------
//      Create passport
// --------------------------------------------
export function createPassport(): PassportStatic {
    passport.use(magicLogin)
    passport.use(jwtLogin)
    return passport
}
