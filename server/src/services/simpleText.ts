import Database from "better-sqlite3";
import { SimpleText, UpdateSimpleText } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js";

function get(key: string): SimpleText | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        simple_text_id as id,
        key,
        text,
        updated_by as updatedBy,
        updated_at as updatedAt
    FROM 
        simple_text 
    WHERE 
        key = ?`)
    const data: SimpleText | undefined = stmt.get(key)
    db.close()
    return data
}

function update(simpleText: UpdateSimpleText, textId: number, userId: number): void {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            UPDATE 
                simple_text
            SET 
                text = ?,
                updated_by = ?
            WHERE 
                simple_text_id = ?`)
        stmt.run(simpleText.text, userId, textId)
    })
    startTransaction()
    db.close()
}

export const simpleTextService = {
    get: get,
    update: update
}