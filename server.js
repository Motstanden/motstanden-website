// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be commited to github.
require("dotenv").config()

const express = require("express")
const bodyParser = require('body-parser');
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const { Client } = require("pg")
const passport = require("passport")
const dbConfig = require("./databaseConfig")

const PORT = process.env.PORT || 5000

const app = express()

// This library automaticly implements security features for the server. The library should be "used" by the app as soon as possible. 
app.use(helmet())

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

// Allows us to acces the req.body object when getting requests.
app.use(bodyParser.json());

// Initializes authentication for requests from the client
require("./passport.js")(passport)
app.use(passport.initialize());

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
        res.send("Secret route was accessed")
    }
)

// Allows us to use files from the paths: './' and './client/.build'
// app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, "client", "build")))

// On ping requests from the client. The purpose of this is to check if the client can communicate with server.js, and in turn that server.js is able to communicate with the database
app.get("/api/ping", (req, frontEndresponse) => {
    
    const client = new Client(dbConfig)
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
