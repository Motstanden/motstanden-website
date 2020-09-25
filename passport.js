
const LocalStrategy = require("passport-local").Strategy
const JWTStrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt
const jwt = require("jsonwebtoken")

const { Client } = require("pg")
const bcrypt = require("bcrypt")

const dbConfig = require("./databaseConfig")

module.exports = (passport) => {

    passport.use(new LocalStrategy( (username, password, done) => {
        // Prevent injection attack py parameterizing input values
        const dbQuery = {
            text: "SELECT user_account_id, username, password  FROM user_account WHERE username = $1",
            values: [username]
        } 
        let credentialsWasCorrect = false

        let user = {
            id: null,
            username: username,
            accessToken: null
        }

        const client = new Client(dbConfig)
        client.connect()
        client.query(dbQuery)
            .then( async (res) => {

                // If there is not only one unique username that is found, something must be wrong. 
                if (res.rowCount !== 1) return done(null, false); 

                user.id = res.rows[0].user_account_id
                const dbPassword = res.rows[0].password
                try {
                    // If an awaited function throws an error the program will break 
                    // If the program breaks, we do not want to authenticate the user
                    credentialsWasCorrect = await bcrypt.compare(password, dbPassword)
                }
                catch(err) { return done(err) }
            })
            .catch( err => console.log(err))
            .finally( () => {

                client.end()

                if (credentialsWasCorrect){
                    const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
                    user.accessToken = accessToken
                    return done(null, user)
                }
                else {
                    return done(null, false)
                }
            })
    }))

    passport.use(new JWTStrategy({
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, (username, done) => {
        user = {
            username: username,
            id: null
        }
        return done(null, user)
    }))

    passport.serializeUser((user, done) => done(null, user.username))
}