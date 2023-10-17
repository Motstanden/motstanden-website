import Database from "better-sqlite3";
import { SimpleText } from "common/interfaces";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig.js";

function get(key: string): SimpleText | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        simple_text_id as id,
        key,
        text
    FROM 
        simple_text 
    WHERE 
        key = ?`)
    const data: SimpleText | undefined = stmt.get(key)
    db.close()
    return data
}

export const simpleTextService = {
    get: get
}