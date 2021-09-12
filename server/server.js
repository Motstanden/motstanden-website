// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be commited to github.
require("dotenv").config()

const express = require("express")
const cookieParser = require('cookie-parser')
const path = require("path")
const cors = require("cors")
const helmet = require("helmet")
const passport = require("passport")
const serveIndex = require("serve-index")

const router = require("./api/apiRouter")

const PORT = process.env.PORT || 5000
const app = express()

// This library automaticly implements security features for the server. The library should be "used" by the app as soon as possible. 
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            scriptSrc: ["'self'"],
            frameSrc: [ "'self'", "https://docs.google.com"],
        }
    }
}))

// Need this to create and parse cookies
app.use(cookieParser())

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

// Allows us to access the req.body object when getting requests.
app.use(express.urlencoded({ extended: true }));    // support encoded bodies
app.use(express.json());                             // support json encoded bodies

// Initializes authentication for requests from the client
require("./config/passportConfig.js")(passport) 
app.use(passport.initialize());

// Allows us to use files from './client/build'
app.use(express.static(path.join(__dirname, "..", "client", "build")))

app.use("/files/private", 
    passport.authenticate("jwt", { session: false }),
    express.static(path.join(__dirname, "files", "private")),
    serveIndex(path.join(__dirname, "files", "private"), {icons: true}))

app.use("/files/public", 
    express.static(path.join(__dirname, "files", "public")),
    serveIndex(path.join(__dirname, "files", "public"), {icons: true}))

app.use("/files", 
    passport.authenticate("jwt", { session: false, failureRedirect: "/api/files/public"}),
    express.static(path.join(__dirname, "files")),
    serveIndex(path.join(__dirname, "files"), {icons: true}))

app.use("/api", router)

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
})

app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
