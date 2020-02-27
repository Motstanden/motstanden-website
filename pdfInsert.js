require("dotenv").config()

const { Client } = require("pg")
const fs = require("fs")
const path = require("path")

const dbConfig = require("./databaseConfig")


filePath = path.join(__dirname, "pdf", "The bare necessities.pdf")

fs.readFile(filePath, "hex", (err, file) => {
    if (err) throw err
    file = "\\x" + file

    const dbQuery = {
        text: "INSERT INTO sheet_arcive(song_id, sheet_file) VALUES (9, $1)",
        values: [file]
    }

    const client = new Client(dbConfig)
    client.connect()
    client.query(dbQuery)
        .then( (res) => {
            console.log(res)
        })
        .catch( (err) => console.log(err))
        .finally( () => {
            client.end()
        })    
})
