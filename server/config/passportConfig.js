import dotenv from "dotenv";
dotenv.config();

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";

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
