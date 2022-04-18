const path = require("path")
const Database = require('better-sqlite3')
const {dbReadOnlyConfig, dbReadWriteConfig} = require("../../server/config/databaseConfig")
const sheetsDb = path.join(__dirname, "..", "sheet_archive_dev.db")

const getSongTitleId = (db, title) => {
    let stmt = db.prepare("SELECT song_title_id FROM song_title where title = ?");
    let value = stmt.get(title)
    return value?.song_title_id
}

const getClefId = (db, clef_name) => {
    let stmt = db.prepare("SELECT clef_id FROM clef where name = ?");
    let value = stmt.get(clef_name)
    return value?.clef_id
}

const getInstrumentId = (db, instrument) => {
    let stmt = db.prepare("SELECT instrument_id FROM instrument where instrument = ?");
    let value = stmt.get(instrument)
    return value?.instrument_id
}

const insertSong = (title, filename, clef_name, instrument_voice, instrument) => {


    if(!title || !filename || !instrument ) {
        console.log(`Did not add file: ${filename}`)
        return false;
    }

    const db = new Database(sheetsDb, dbReadWriteConfig)

    const clefId = getClefId(db, clef_name)
    if(!clefId) 
        throw `Could not find clef_id. \nclef: "${clef_name}" \nFile: "${filename}"`;

    const instrumentId = getInstrumentId(db, instrument)
    if(!instrumentId)
        throw `Could not find instrument. \nInstrument: "${instrument}" \nFile: "${filename}"`

    // Define transaction
    const startTransaction = db.transaction( () => {

        let titleId = getSongTitleId(db, title);
        if(!titleId){
            
            titleId = db.prepare("INSERT INTO song_title(title) VALUES (?);")
                        .run(title)
                        .lastInsertRowid
        }

        const stmt = db.prepare(`
            INSERT INTO 
                song_file(song_title_id, filename, clef_id, instrument_id, instrument_voice)
            VALUES 
                (?, ?, ?, ?, ?)
        `)
        const info = stmt.run(titleId, filename, clefId, instrumentId, instrument_voice)
    })

    // Run transaction
    startTransaction();
}

exports.insertSong = insertSong;