// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be commited to github.
require("dotenv").config()

const express = require("express")
const bodyParser = require('body-parser')
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const { Client } = require("pg")
const sqlite3 = require("sqlite3")
const passport = require("passport")
const dbConfig = require("./databaseConfig")
const { json } = require("express");
const verifyGithubPayload = require("./verifyGithubPayload");
const { Console } = require("console")

const PORT = process.env.PORT || 5000
const DBFILENAME = path.join(__dirname, "motstanden.db")
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

app.get("/api/sheet_arcive_song", 
    passport.authenticate("jwt", {session: false}),
        (req, res) => {
        const dbQuery = {
            text: "SELECT song_id, title FROM song ORDER BY title ASC"
        }
        client = new Client(dbConfig)
        client.connect()
        client.query(dbQuery)
            .then( dbRes => {
                // console.log(dbRes.rows)
                res.send(dbRes.rows) 
            })
            .catch( err => console.log(err))
            .finally( () => {
                client.end()
                res.end()
            } )
})


app.get("/api/sheet_arcive_file", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const dbQuery = {
            text: "SELECT sheet_file FROM sheet_arcive WHERE song_id = $1 LIMIT 1",
            values: [req.query.song_id]
        }

        client = new Client(dbConfig)
        client.connect()
        client.query(dbQuery)
            .then( dbRes => {
                let file = dbRes.rows[0].sheet_file
                res.writeHead(200, {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=some_file.pdf',
                    'Content-Length': file.length
                });
                res.end(file)
            })
            .catch(err => console.log(err))
            .finally( () => {
                client.end()
                res.end()
            })
    })

app.get("/api/quotes", 
    // passport.authenticate("jwt", {session: false}),
        (req, res) => {
        const dbQuery = "SELECT utterer, quote FROM quote ORDER BY quote_id DESC"
        var db = new sqlite3.Database(DBFILENAME, sqlite3.OPEN_READONLY)

        db.serialize( () => {
            db.all(dbQuery, (err, rows) => {
                if(err) { console.log(err) }
                else {
                    res.send(rows)
                }
            })
        });
        db.close()
})

app.post("/api/insert_quote",    
    // passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const dbQuery = {
            text: "INSERT INTO quote(utterer, quote) VALUES (?, ?)",
            values: [req.body.utterer, req.body.quote]
        }
        var db = new sqlite3.Database(DBFILENAME, sqlite3.OPEN_READWRITE)
        db.run(dbQuery.text, dbQuery.values, (err) => console.log(err || "Quote inserted"))
        db.close()
        res.end()
    })

app.get("/api/documents", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const documents = [{
            title: "Bulleltin 2019-2020",
            file: "files/documents/bulleltin-2019-2020.pdf"
        },{
            title: "Motstandens statutter",
            file: "files/documents/motstandens-statutter.pdf"
        }]
        res.send(documents)
    }
)

app.get("/api/document_file", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const filePath = path.join(__dirname, req.query.file)
        res.sendFile(filePath)
    }
)

app.post("/api/repository-update",
    verifyGithubPayload,
    (req, res) => {
        //TODO
})

// Allows us to use files from the paths: './' and './client/.build'
// app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"))
})

app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
