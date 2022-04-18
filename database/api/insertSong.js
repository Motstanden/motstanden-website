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
    let dbResult = stmt.get(clef_name)
    if(!dbResult) 
        throw `Could not find id of clef: "${clef_name}"`;
    return dbResult.clef_id
}

const getCategoryId = (db, category) => {
    let stmt = db.prepare("SELECT instrument_category_id FROM instrument_category WHERE category = ?")
    let dbResult = stmt.get(category)
    if(!dbResult)
        throw `Could not find id of instrument category ${category}`
    return dbResult.instrument_category_id
}

const getInstrumentId = (db, instrument, category) => {
    
    let dbResult = null;

    let isPartSystem = instrument.toLowerCase().startsWith("part") 
    let isSuperPart = instrument.toLowerCase().startsWith("superpart")

    if (isPartSystem || isSuperPart) {
        if (isSuperPart && !category)
            category = "Annet"
        else if(!category)
            throw `AmbiguousException: You must provide a category when requesting "${instrument}"`
        let categoryId = getCategoryId(db, category)
        let stmt = db.prepare("SELECT instrument_id FROM instrument where instrument = ? AND instrument_category_id = ?")
        dbResult = stmt.get(instrument, categoryId)
    }
    else{
        let stmt = db.prepare("SELECT instrument_id FROM instrument where instrument = ?");
        dbResult = stmt.get(instrument)
    }

    if(!dbResult)
        throw `Could not find id of instrument "${instrument}" with category "${category}"`

    return dbResult.instrument_id
}

const getToneId = (db, tone_name) => {
    let stmt = db.prepare("SELECT tone_id FROM tone where name = ?");
    let dbResult = stmt.get(tone_name)
    if(!dbResult) 
        throw `Could not find id of tone: "${tone_name}"`;
    return dbResult.tone_id
}

const insertSong = (title, filename, clef_name, instrument_voice, instrument, transposition, instrument_category) => {

    if(!title || !filename || !instrument ) {
        console.log(`Did not add file: ${filename}`)
        return false;
    }

    const db = new Database(sheetsDb, dbReadWriteConfig)

    // Throws exceptions if not found
    const clefId = getClefId(db, clef_name)
    const instrumentId = getInstrumentId(db, instrument, instrument_category) 
    const transpositionId = getToneId(db, transposition)

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
                song_file(song_title_id, filename, clef_id, instrument_id, instrument_voice, transposition)
            VALUES 
                (?, ?, ?, ?, ?, ?)
        `)
        const info = stmt.run(titleId, filename, clefId, instrumentId, instrument_voice, transpositionId)
    })

    // Run transaction
    startTransaction();
}

exports.insertSong = insertSong;