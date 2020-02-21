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

app.post("/api/login", (req, res) => {
    
    const username = req.body.username
    const password = req.body.password
    let credentialsWasCorrect = false

    // Prevent injection attack py parameterizing input values
    const dbQuery = {
        text: "SELECT username, password  FROM user_account WHERE username = $1",
        values: [username]
    } 

    const client = new Client(clientInfo)
    client.connect()
    client.query(dbQuery)
        .then( async (res) => {

            // If there is not only one unique username that is found, something must be wrong. 
            if (res.rowCount !== 1) return; 

            const dbPassword = res.rows[0].password
            try {
                // If an awaited function throws an error the program will break 
                // If the program breaks, we do not want to authenticate the user
                credentialsWasCorrect = await bcrypt.compare(password, dbPassword)
            }
            catch {}
        })
        .catch( err => console.log(err))
        .finally( () => {
            
            let response = "Authenticated: " + credentialsWasCorrect.toString()
            console.log(response)
            
            client.end()
            res.send(response)
        })
})



app.listen(PORT, () => console.log("The server is listening on port " + PORT.toString()))
