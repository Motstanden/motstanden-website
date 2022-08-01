
const LocalStrategy = require("passport-local").Strategy
const JWTStrategy = require("passport-jwt").Strategy
const jwt = require("jsonwebtoken")

const Database = require('better-sqlite3')
const bcrypt = require("bcrypt")

const {motstandenDB, dbReadOnlyConfig, dbReadWriteConfig} = require("./databaseConfig")
const passport = require("passport")

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

const UseLocalStrategy = (passport) => {
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

const UseJwtStrategy = (passport) => {
    passport.use(new JWTStrategy({
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: ExtractJwtFromCookie
    }, (username, done) => {
        user = {
            username: username,
            id: null
        }
        return done(null, user)
    }))
}

module.exports = { UseLocalStrategy, UseJwtStrategy }



