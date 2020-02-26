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
const whiteList = [ 
    "http://localhost:3000", 
    "https://localhost:3000",
    "http://localhost:5000", 
    "https://localhost:5000",
    "http://motstanden.no", 
    "https://motstanden.no",
    "http://motstanden.no/", 
    "https://motstanden.no/"
]
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            console.log(origin, " was allowed")
            callback(null, true)
        } else {
        callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))

// Allows us to acces the req.body object when getting requests.
app.use(bodyParser.json());

// Initializes authentication for requests from the client
require("./passport.js")(passport)
app.use(passport.initialize());

// Initializes debug.js 
require("./debug.js")(app, passport)

app.post("/api/login", 
    passport.authenticate("local", {session: false}),
    (req, res) => {

        res.json({
            accessToken: req.user.accessToken,
            message: "Du er logget inn som " + req.user.username
        })
})

app.get("/api/song_lyric_title", (req, res) => {

    dbQuery = "SELECT title FROM song_lyric ORDER BY title ASC"

    client = new Client(dbConfig)
    client.connect()
    client.query(dbQuery)
        .then( dbRes => {
            res.json({lyricsArray: dbRes.rows})
            // console.log(dbRes.rows)
        })
        .catch( err => console.log(err))
        .finally( () => {
            client.end()
            res.end() 
        })
})

app.get("/api/song_lyric_data", (req, res) => {

    const dbQuery = {
        text: "SELECT lyric_html_content FROM song_lyric WHERE title = $1",
        values: [req.query.title]
    } 

    client = new Client(dbConfig)
    client.connect()
    client.query(dbQuery)
        .then( dbRes => {
            // console.log({lyricsData: dbRes.rows[0].lyric_html_content})
            res.json({lyricsData: dbRes.rows[0].lyric_html_content})
        })
        .catch( err => console.log(err))
        .finally( () => {
            client.end()
            res.end() 
        })
})

// Allows us to use files from the paths: './' and './client/.build'
// app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
