import * as Mail from './mailConfig.js';
import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import MagicLoginStrategy from 'passport-magic-login';
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from './databaseConfig.js';
import { getRandomInt } from '../utils/getRandomInt';
import passport, { PassportStatic } from 'passport';
import { Request } from 'express';
import { sleepAsync } from '../utils/sleepAsync';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';



export function useLocalStrategy(passport: PassportStatic) {
    passport.use(new LocalStrategy( async (username, password, done) => {
        
        username = username.trim().toLowerCase();
        
        // Get the user from the database 
        const db = new Database(motstandenDB, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT user_account_id, username, password FROM user_account WHERE username = ?")
        const dbUser = stmt.get(username)
        db.close();
        
        // Check if password matches
        let passwordMatches = false;
        if (dbUser) {
            try {
                passwordMatches = await bcrypt.compare(password, dbUser.password)
            }
            catch (err) { console.log(err) }
        }
        else {
            // We want to wait if something goes wrong. This prevents brute force attacks.
            await sleepAsync(getRandomInt(1500, 2500))
        }
        
        // Create access token and continue if password matches. Otherwise, terminate the request.
        if (passwordMatches) {
            const user = {
                    id: dbUser.user_account_id,
                    username: username,
                    accessToken: jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
                }
                return done(null, user)
            }
        else {
            return done(null, false)
        }
    }))
    
}
export function serializeUser(passport: PassportStatic) {
    passport.serializeUser((user, done) => done(null, user.username))
}

export function deserializeUser(passport: PassportStatic){
    passport.deserializeUser((user, done) => done(null, user))
}

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
