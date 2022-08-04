// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be committed to github.
import dotenv from "dotenv";
dotenv.config({ path: "../.env"});

import express from "express"
import cookieParser from 'cookie-parser'
import path from "path"
import cors from "cors"
import helmet from "helmet"
import passport from "passport"
import * as passportConfig from "./config/passportConfig.js"
import serveIndex from "serve-index"

import router from "./api/apiRouter.js"

import { getCurrentDir } from './utils/pathHelper.js';
const __dirname = getCurrentDir(import.meta.url);

const PORT = process.env.PORT || 5000
const app = express()

// This library automatically implements security features for the server. The library should be "used" by the app as soon as possible. 
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
app.use(cors())

// Allows us to access the req.body object when getting requests.cd 
app.use(express.urlencoded({ extended: true }));    // support encoded bodies
app.use(express.json());                            // support json encoded bodies

// Initializes authentication for requests from the client
passportConfig.UseLocalStrategy(passport)
passportConfig.UseJwtStrategy(passport)
passportConfig.serializeUser(passport)
passportConfig.UseMagicLinkStrategy(passport, app)


app.use("/files/private", 
    passport.authenticate("jwt", { session: false, failureRedirect: "/files/public" }),
    express.static(path.join(__dirname, "..", "files", "private")),
    serveIndex(path.join(__dirname, "..", "files", "private"), {icons: true}))

app.use("/files/public", 
    express.static(path.join(__dirname, "..", "files", "public")),
    serveIndex(path.join(__dirname, "..", "files", "public"), {icons: true}))

app.use("/files", 
    passport.authenticate("jwt", { session: false, failureRedirect: "/files/public"}),
    express.static(path.join(__dirname, "..", "files")),
    serveIndex(path.join(__dirname, "..", "files"), {icons: true}))

app.use("/api", router)

// Allows us to use files from './client/build'
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.html"))
})

app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
