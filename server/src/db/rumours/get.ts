import Database from "better-sqlite3"
import { Rumour } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

export function get(rumourId: number): Rumour | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            rumour_id as id, 
            rumour, 
            created_by as createdBy,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            rumour 
        WHERE rumour_id = ?
    `)
    const rumour = <Rumour | undefined>stmt.get(rumourId)
    db.close()
    return rumour
}

export function getAll(limit?: number): Rumour[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            rumour_id as id, 
            rumour, 
            created_by as createdBy,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            rumour 
        ORDER BY 
            rumour_id DESC
        ${!!limit ? "LIMIT ?" : ""}
    `)
    const rumours = !!limit ? stmt.all(limit) : stmt.all()
    db.close()
    return rumours as Rumour[]
}
