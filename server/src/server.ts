import cookieParser from 'cookie-parser'
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import serveIndex from "serve-index"
import { fileURLToPath } from 'url'
import * as passportConfig from "./config/passportConfig.js"

import { apiRoutes } from "./api/index.js"
import { AuthenticateUser } from "./middleware/jwtAuthenticate.js"

function resolvePath(relativePath: string) {
    return fileURLToPath(new URL(relativePath, import.meta.url))
}

// Loads secret keys from the local .env file
dotenv.config({ path: resolvePath("../.env") })

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

// Serve files from the server
app.use("/files/private",
    AuthenticateUser({ failureRedirect: "/files/public" }),
    express.static(resolvePath("../files/private")),
    serveIndex(resolvePath("../files/private"), { icons: true }))

app.use("/files/public",
    express.static(resolvePath("../files/public")),
    serveIndex(resolvePath("../files/public"), { icons: true }))

app.use("/files",
    AuthenticateUser({ failureRedirect: "/files/public" }),
    express.static(resolvePath("../files")),
    serveIndex(resolvePath("../files"), { icons: true }))

// API routes – our bread and butter
app.use("/api", apiRoutes)

// Allows us to use files from './client/build'
app.use(express.static(resolvePath("../../client/build")))

app.get("*", (req, res) => {
    res.sendFile(resolvePath("../../client/build/index.html"))
})

app.listen(PORT, () => console.log(process.env.IS_DEV_ENV ? `Back-end server running on http://localhost:${PORT}` : `Server running on port ${PORT}` ))
