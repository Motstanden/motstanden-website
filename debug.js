const { Client } = require("pg")
const dbConfig = require("./databaseConfig")


module.exports = (app, passport) => {
    
    app.get("/api/protected",
        passport.authenticate("jwt", {session: false}),
        (req, res) => {
            // console.log(req.user)
            res.json({
                username: req.user.username,
                message: "You are logged in as: " + req.user.username
            })
        }
        )

    // On ping requests from the client. The purpose of this is to check if the client can communicate with server.js, and in turn that server.js is able to communicate with the database
    app.get("/api/ping", (req, frontEndresponse) => {
        console.log("ping")
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
}

