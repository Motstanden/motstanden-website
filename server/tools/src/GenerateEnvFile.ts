// ******************************************************************
//  Summary:
//      This scripts generate a .env file that can be used in a dev environment. 
//      The .env file is similar to the secret .env file on the server
//
//  Usage:
//      1.  Run from terminal: node GenerateEnvFile
//      2.  Copy .env file /server 
//
// ******************************************************************

import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

let envObjects = []

// Dev Environment
envObjects.push({
    name: "IS_DEV_ENV",
    value: true
})

// Access token
const accessToken = randomBytes(256)
envObjects.push({
    name: "ACCESS_TOKEN_SECRET",
    value: accessToken.toString('hex')
})

// Refresh token
const refressToken = randomBytes(256)
envObjects.push({
    name: "REFRESH_TOKEN_SECRET",
    value: refressToken.toString('hex')
})

// Build string with the env data
let fileString = ""
envObjects.forEach(item => {
    fileString += `${item.name}=${item.value}\n`
});

// Write data string to file
const filename = path.join(__dirname, ".env")
fs.writeFileSync(filename, fileString)