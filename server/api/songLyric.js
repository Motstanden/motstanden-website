const router = require("express").Router()
const Database = require('better-sqlite3')
const {dbFilename, dbReadOnlyConfig, dbReadWriteConfig} = require("../config/databaseConfig")
const fs = require("fs")

router.get("/song_lyric", (req, res) => {
    const db = new Database(dbFilename, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT \
                                title, \
                                url, \
                                song_melody AS melody, \
                                song_text_origin AS textOrigin, \
                                song_description AS description \
                            FROM song_lyric ORDER BY title")
    const lyrics = stmt.all()
    res.send(lyrics)
    db.close()
})

router.get("/song_lyric_data", (req, res) => {

    // Get the name of the html file
    const db = new Database(dbFilename, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT full_filename AS file FROM song_lyric WHERE title = ?")
    const title = req.query.title;
    const filename = stmt.get([title]).file
    db.close()

    // Send html file as string
    fs.readFile(filename, (err, data) => {
        if(err) {
            throw err;
        }
        else{
            res.json({lyricHtml: data.toString()})
        }
    });
})

module.exports = router;