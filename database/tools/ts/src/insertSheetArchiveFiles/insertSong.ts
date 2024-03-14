import Database, { Database as DatabaseType } from 'better-sqlite3';
import { dbReadWriteConfig, sheetArchiveDB } from "../databaseConfig";

type ObjectWithId = { id: number }

function getSongTitleId(db: DatabaseType, title: string, extraInfo?: string | null): number {
    extraInfo ??= ""
    const stmt = db.prepare(`
        SELECT 
            song_title_id as id 
        FROM 
            song_title 
        WHERE 
            title = ? AND extra_info = ?
    `);
    const dbResult = stmt.get([title, extraInfo]) as ObjectWithId | undefined

    if (dbResult?.id === undefined)
        throw `Could not find id of song title: ${title}`
    
    return dbResult.id
}

function getClefId(db: DatabaseType, clef_name: string): number {
    const stmt = db.prepare(`
        SELECT 
            clef_id as id
        FROM 
            clef 
        WHERE 
            name = ?`
    )
    const dbResult = stmt.get(clef_name) as ObjectWithId | undefined

    if (dbResult?.id === undefined)
        throw `Could not find id of clef: "${clef_name}"`

    return dbResult.id
}

function getCategoryId(db: DatabaseType, category: string): number {
    const stmt = db.prepare(`
        SELECT 
            instrument_category_id as id
        FROM 
            instrument_category 
        WHERE category = ?`
    )
    const dbResult = stmt.get(category) as ObjectWithId | undefined
    if (dbResult?.id === undefined)
        throw `Could not find id of instrument category ${category}`
    return dbResult.id
}

function getInstrumentId(db: DatabaseType, instrument: string, category: string | null): number {

    let dbResult: ObjectWithId | undefined = undefined

    const isPartSystem = instrument.toLowerCase().startsWith("part")
    const isSuperPart = instrument.toLowerCase().startsWith("superpart")

    if (isPartSystem || isSuperPart) {
        
        if (isSuperPart && !category)
            category = "Annet"
        else if (!category)
            throw `AmbiguousException: You must provide a category when requesting "${instrument}"`

        const categoryId = getCategoryId(db, category)
        const stmt = db.prepare(`
            SELECT 
                instrument_id as id 
            FROM 
                instrument 
            WHERE 
                instrument = ? AND instrument_category_id = ?
            `)
        dbResult = stmt.get(instrument, categoryId) as ObjectWithId | undefined
    }
    else {
        const stmt = db.prepare(`
            SELECT 
                instrument_id as id 
            FROM 
                instrument 
            WHERE 
                instrument = ?
            `)
        dbResult = stmt.get(instrument) as ObjectWithId | undefined
    }

    if (dbResult?.id === undefined)
        throw `Could not find id of instrument "${instrument}" with category "${category}"`

    return dbResult.id
}

function getToneId(db: DatabaseType, tone_name: string): number {
    const stmt = db.prepare(`
        SELECT 
            tone_id as id 
        FROM 
            tone 
        WHERE 
            name = ?`);
    const dbResult = stmt.get(tone_name) as ObjectWithId | undefined;
    if (dbResult?.id === undefined)
        throw `Could not find id of tone: "${tone_name}"`;
    return dbResult.id
}

export function insertSongFile(
    title: string, 
    extra_info: string | null, 
    filename: string, 
    clef_name: string, 
    instrument_voice: number, 
    instrument: string, 
    transposition: string, 
    instrument_category: string | null
) {
    const db = new Database(sheetArchiveDB, dbReadWriteConfig);

    // Throws exceptions if not found
    const clefId = getClefId(db, clef_name);
    const instrumentId = getInstrumentId(db, instrument, instrument_category);
    const transpositionId = getToneId(db, transposition);
    const titleId = getSongTitleId(db, title, extra_info);

    // Define transaction
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            INSERT INTO 
                song_file(song_title_id, filename, clef_id, instrument_id, instrument_voice, transposition)
            VALUES 
                (?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(titleId, filename, clefId, instrumentId, instrument_voice, transpositionId);
    });

    // Run transaction
    startTransaction();
}

export function insertSongTitle(title: string, extra_info: string | null, directory: string) {
    const db = new Database(sheetArchiveDB, dbReadWriteConfig);
    extra_info ??= "";
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare("INSERT INTO song_title(title, extra_info, directory) VALUES (?, ?, ?)");
        const info = stmt.run(title, extra_info, directory);
    });

    startTransaction();
}