const express = require("express")
const bodyParser = require('body-parser');
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const { Client } = require("pg")
const bcrypt = require("bcrypt")

// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be commited to github.
require("dotenv").config()
// Gets the secret content from the .env file
const clientInfo = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE_NAME,
    ssl: {
        rejectUnauthorized: false
    }
}

const PORT = process.env.PORT || 5000

const app = express()

// This library automaticly implements security features for the server. The library should be "used" by the app as soon as possible. 
app.use(helmet())

// Allows us to acces the req.body object when getting requests.
app.use(bodyParser.json());

// Alows us to make request from localhost:3000 and whatever domain the server is running on
const whiteList = [ "http://localhost:3000"]
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
        callback(new Error('Not allowed by CORS'))
        }
    }
}
app.use(cors(corsOptions))

// ---------------------------------------------------------
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const jwt = require("jsonwebtoken")

const JWTStrategy = require("passport-jwt").Strategy
const ExtractJWT = require("passport-jwt").ExtractJwt

app.use(passport.initialize());

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

    const client = new Client(clientInfo)
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

passport.serializeUser((user, done) => done(null, user.username))

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


app.post("/api/login", 
    passport.authenticate("local", {session: false}),
    (req, res) => {

        res.json({
            accessToken: req.user.accessToken,
            message: "Authentication was succesfful"
        })

        res.send()
})

app.get("/api/protected",
    passport.authenticate("jwt", {session: false}),
    (req, res) => {

        console.log("accessed protected")
        res.send("Secret route was accessed")
    }
)

// ---------------------------------------------------------

// Allows us to use files from the paths: './' and './client/.build'
// app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, "client", "build")))

// On ping requests from the client. The purpose of this is to check if the client can communicate with server.js, and in turn that server.js is able to communicate with the database
app.get("/api/ping", (req, frontEndresponse) => {
    
    const client = new Client(clientInfo)
    client.connect()
    let dbResponse = ""
    client
        .query("select * from ping")
        .then(res => dbResponse = res.rows[0].ping)
        .catch(error => {dbResponse = error.name + ": " + error.message})
        .finally( () => {
            data = {
                apiResponse: "Pong from the api",
                dbResponse: dbResponse
            }
            client.end()
            frontEndresponse.send(data)
        })
})

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
