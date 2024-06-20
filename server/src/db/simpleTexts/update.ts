import Database from "better-sqlite3"
import { UpdateSimpleText } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function update(simpleText: UpdateSimpleText, textId: number, userId: number): void {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            simple_text
        SET 
            text = ?,
            updated_by = ?
        WHERE 
            simple_text_id = ?`)
    stmt.run(simpleText.text, userId, textId)
    db.close()
}
