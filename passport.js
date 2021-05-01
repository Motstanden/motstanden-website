
const LocalStrategy = require("passport-local").Strategy
const JWTStrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")

const Database = require('better-sqlite3')
const bcrypt = require("bcrypt")

const path = require("path")
const DBFILENAME = path.join(__dirname, "motstanden.db")

// TODO: Move this to separate file
const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}
const dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}
const GetRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
}
const SleepAsync = async (ms) => {
    return new Promise( resolve => setTimeout(resolve, ms))
}


module.exports = (passport) => {

    passport.use(new LocalStrategy( async (username, password, done) => {
        
        // Get the user from the database 
        const db = new Database(DBFILENAME, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT user_account_id, username, password FROM user_account WHERE username = ?")
        const dbUser = stmt.get(username)
        db.close();
 
        // Check if pasword matches
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
    
    const ExtractJwtFromCookie = (req) => {
        let token = null
        if(req && req.cookies){
            token = req.cookies["AccessToken"]
        }
        return token;
    }

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


    passport.serializeUser((user, done) => done(null, user.username))
}