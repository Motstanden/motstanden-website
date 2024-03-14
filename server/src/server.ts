// Loads secret keys from the local .env file. The .env file should always be a hidden secret, and should not be committed to github.
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import helmet from "helmet";
import serveIndex from "serve-index";
import { fileURLToPath } from 'url';
import * as passportConfig from "./config/passportConfig.js";

import router from "./api/apiRouter.js";
import { AuthenticateUser } from "./middleware/jwtAuthenticate.js";

const PORT = process.env.PORT || 5000
const app = express()

// This library automatically implements security features for the server. The library should be "used" by the app as soon as possible. 
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'", "styret.motstanden.no"],
            scriptSrc: ["'self'"],
            frameSrc: ["'self'", "https://docs.google.com"],
        }
    }
}))

// We need this in order to load google forms on our site
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "cross-origin")
    next()
})

// Need this to create and parse cookies
app.use(cookieParser())
app.use(cors())

// Allows us to access the req.body object when getting requests.cd 
app.use(express.urlencoded({ extended: true }));    // support encoded bodies
app.use(express.json());                            // support json encoded bodies

// Initializes authentication for requests from the client
const passport = passportConfig.createPassport()
app.use(passport.initialize());

const allFilesPath     = fileURLToPath(new URL("../files",  import.meta.url))
const privateFilesPath = fileURLToPath(new URL("../files/private", import.meta.url))
const publicFilesPath  = fileURLToPath(new URL("../files/public",  import.meta.url))

app.use("/files/private",
    AuthenticateUser({ failureRedirect: "/files/public" }),
    express.static(privateFilesPath),
    serveIndex(privateFilesPath, { icons: true }))

app.use("/files/public",
    express.static(publicFilesPath),
    serveIndex(publicFilesPath, { icons: true }))

app.use("/files",
    AuthenticateUser({ failureRedirect: "/files/public" }),
    express.static(allFilesPath),
    serveIndex(allFilesPath, { icons: true }))

app.use("/api", router)

// Allows us to use files from './client/build'
app.use(express.static(fileURLToPath(new URL("../../client/build", import.meta.url))))

app.get("*", (req, res) => {
    res.sendFile(fileURLToPath(new URL("../../client/build/index.html", import.meta.url)))
})

app.listen(PORT, () => console.log(process.env.IS_DEV_ENV ? `Back-end server running on http://localhost:${PORT}` : `Server running on port ${PORT}` ))
