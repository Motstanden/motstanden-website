import Database from "better-sqlite3";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";
import { Rumour } from "common/interfaces"
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils";

function get(rumourId: number): Rumour{
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
    const rumour: Rumour | undefined = stmt.get(rumourId)
    db.close()

    if(!rumour)
        throw "Bad data"

    return rumour
}

function getAll(limit?: number): Rumour[] {
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

export const rumourService = {
    get: get,
    getAll: getAll
}