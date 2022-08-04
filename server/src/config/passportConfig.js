import dotenv from "dotenv";
dotenv.config();

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import MagicLoginStrategy from "passport-magic-login";
import jwt from "jsonwebtoken";

import * as Mail from "./mailConfig.js"

import Database from "better-sqlite3";
import bcrypt from "bcrypt";

import { motstandenDB, dbReadOnlyConfig, dbReadWriteConfig } from "./databaseConfig.js";

const GetRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
}
const SleepAsync = async (ms) => {
    return new Promise( resolve => setTimeout(resolve, ms))
}

const ExtractJwtFromCookie = (req) => {
    let token = null
    if(req && req.cookies){
        token = req.cookies["AccessToken"]
    }
    return token;
}

export const UseLocalStrategy = (passport) => {
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
            await SleepAsync(GetRandomInt(1500, 2500))
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

export const UseJwtStrategy = (passport) => {
    passport.use(new JWTStrategy({
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: ExtractJwtFromCookie
    }, (username, done) => {
        const user = {
            username: username,
            id: null
        }
        return done(null, user)
    }))
}

export const serializeUser = (passport) => passport.serializeUser((user, done) => done(null, user.username))

export const UseMagicLinkStrategy = (passport, app) => {

    const baseUrl = process.env.IS_DEV_ENV === 'true' 
                  ? 'http://localhost:3000'
                  : 'https://motstanden.no'
                  
    const callbackUrl = "api/auth/magic_login/callback"         

    // IMPORTANT: ALL OPTIONS ARE REQUIRED!
    const magicLogin = new MagicLoginStrategy.default({
        // Used to encrypt the authentication token. Needs to be long, unique and (duh) secret.
        secret: process.env.ACCESS_TOKEN_SECRET,
    
        // The authentication callback URL
        callbackUrl: callbackUrl,
    
        // Called with th e generated magic link so you can send it to the user
        // "destination" is what you POST-ed from the client
        // "href" is your confirmUrl with the confirmation token,
        // for example "/auth/magiclogin/confirm?token=<longtoken>"
        sendMagicLink: async (destination, href) => {
            console.log(`Sending email to ${destination}     ${baseUrl}${href}`)
            await Mail.transporter.sendMail({
                from: Mail.InfoMail,
                to: destination,
                subject: "Logg inn på Motstanden",
                text: `Klikk på denne linken for å logge deg inn på Motstanden.no på denne enheten: ${baseUrl}/${href}`
            })
            console.log("Mail sent")
        },
    
        // Once the user clicks on the magic link and verifies their login attempt,
        // you have to match their email to a user record in the database.
        // If it doesn't exist yet they are trying to sign up so you have to create a new one.
        // "payload" contains { "destination": "email" }
        // In standard passport fashion, call callback with the error as the first argument (if there was one)
        // and the user data as the second argument!
        verify: (payload, callback) => {
        // Get or create a user with the provided email from the database
        // getOrCreateUserWithEmail(payload.destination)
        //     .then(user => {
        //     callback(null, user)
        //     })
        //     .catch(err => {
        //     callback(err)
        //     })
            console.log(`Verifying user,   payload: ${payload}`)
            callback(null, "MyUser")
        }
    })

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });

    // Add the passport-magic-login strategy to Passport
    passport.use(magicLogin)

    // This is where we POST to from the frontend
    app.post("/api/auth/magic_login", magicLogin.send);

    app.use(passport.initialize());

    // The standard passport callback setup
    app.get("/api/auth/magic_login/callback", passport.authenticate("magiclogin"), (req, res) => {

        const token = jwt.sign("MyUser", process.env.ACCESS_TOKEN_SECRET)
        res.cookie("AccessToken", 
            token, { 
                httpOnly: true, 
                secure: true, 
                sameSite: true, 
                maxAge: 1000 * 60 * 60 * 24 * 31 // 31 days 
        })
        res.redirect("/hjem")
    });
}