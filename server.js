// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be commited to github.
require("dotenv").config()

const express = require("express")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const { Client } = require("pg")
const Database = require('better-sqlite3')
const passport = require("passport")
const dbConfig = require("./databaseConfig")
const { json } = require("express");
const verifyGithubPayload = require("./verifyGithubPayload");
const serveIndex = require("serve-index")


const PORT = process.env.PORT || 5000
const DBFILENAME = path.join(__dirname, "motstanden.db")
const app = express()
const ACCESSTOKEN = "AccessToken"
// This library automaticly implements security features for the server. The library should be "used" by the app as soon as possible. 
app.use(helmet())

// Need this to create and parse cookies
app.use(cookieParser())

const dbReadOnlyConfig = {
    readonly: true,
    fileMustExist: true
}

const dbReadWriteConfig = {
    readonly: false,
    fileMustExist: true
}

// TODO: Move this to a another file.
const StringIsNullOrWhiteSpace = (inputString) => {
    result = true
    if (inputString) {                              // Check if value is defined
        if (typeof inputString === 'string') {      // Check if value is a string
            if (inputString.trim()) {               // Check if value contains any non white space characters
               result = false 
            }
        }
    }
    return result;
}

// Alows us to make request from localhost:3000 and whatever domain the server is running on
const whiteList = [ 
    "http://localhost:3000", 
    "https://localhost:3000",
    "http://localhost:5000", 
    "https://localhost:5000",
    "http://motstanden.no", 
    "https://motstanden.no",
    "http://www.motstanden.no",
    "https://www.motstanden.no"
]
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
        callback(new Error('Not allowed by CORS'))
        }
    },
}
app.use(cors(corsOptions))

// Allows us to acces the req.body object when getting requests.
app.use(bodyParser.json());  // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Initializes authentication for requests from the client
require("./passport.js")(passport) 
app.use(passport.initialize());

// Initializes debug.js 
require("./debug.js")(app, passport)

app.post("/api/login", 
    passport.authenticate("local", {session: false}),
    (req, res) => {
        res.cookie(ACCESSTOKEN, 
            req.user.accessToken, { 
                httpOnly: true, 
                secure: true, 
                sameSite: true, 
                maxAge: 1000 * 60 * 60 * 24 * 14 // 14 days 
        })
        res.json({
            message: "Du er logget inn som " + req.user.username
        })
})

app.post("/api/logout", (req, res) => {
    res.clearCookie(ACCESSTOKEN)
    res.end()
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

app.get("/api/sheet_arcive", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const db = new Database(DBFILENAME, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT title, url FROM sheet_archive ORDER BY title DESC")
        const sheets = stmt.all()
        res.send(sheets);
        db.close()
})

app.get("/api/quotes", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const db = new Database(DBFILENAME, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT utterer, quote FROM quote ORDER BY quote_id DESC")
        const quotes = stmt.all();
        res.send(quotes);
        db.close();
})

app.post("/api/insert_quote",    
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const utterer = req.body.utterer
        const quote = req.body.quote
        if (StringIsNullOrWhiteSpace(utterer) || StringIsNullOrWhiteSpace(quote)) {
            res.status(400).send("The server could not parse the payload.")
        } else {
            const db = new Database(DBFILENAME, dbReadWriteConfig)
            const stmt = db.prepare("INSERT INTO quote(utterer, quote) VALUES (?, ?)")    
            stmt.run(utterer, quote)
            db.close();
        }
        res.end();
    })

app.get("/api/documents", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const db = new Database(DBFILENAME, dbReadOnlyConfig)
        const stmt = db.prepare("SELECT title, url FROM document ORDER BY document_id DESC")
        const documents = stmt.all();
        res.send(documents)
        db.close()
    }
)

app.post("/api/repository-update",
    verifyGithubPayload,
    (req, res) => {
        //TODO
})

// Allows us to use files from './client/build'
app.use(express.static(path.join(__dirname, "client", "build")))

app.use("/api", passport.authenticate("jwt", { session: false }),
    express.static(path.join(__dirname, "files")),
    serveIndex(path.join(__dirname, "files"), {icons: true}))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
