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
}, (user, done) => done(null, user)) 


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

function onVerifyLinkClick(
    payload: IPayLoad, 
    callback: (err?: Error | undefined, user?: Object | undefined, info?: any) => void
): void {
    // TODO:
    //      - Ensure that the link is only allowed to be clicked exactly once
    //      - Retrieve user information and send it further
    callback( /*Error*/ undefined, {email: payload.destination})
}

export const magicLogin = new MagicLoginStrategy({
    secret: process.env.ACCESS_TOKEN_SECRET,
    callbackUrl: `api/${MagicLinkCallbackPath}`,
    sendMagicLink: onSendMagicLinkRequest,
    verify: onVerifyLinkClick,     
})

interface IPayLoad {
    destination: string,
    code: string,
    iat: number,        // iat = Issued at. Is NumericDate value, which is defined as defined as the number of seconds (not milliseconds) since Epoch:
    exp: number         // exp = Expiration Time. ----||---- 
}

export interface IUser {
    email: string
}

// --------------------------------------------
//      Create passport
// --------------------------------------------
export function createPassport(): PassportStatic {
    passport.use(magicLogin)
    passport.use(jwtLogin)
    return passport
}
