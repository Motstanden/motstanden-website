import Database from "better-sqlite3";
import { NewRumour, Rumour } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils";

function get(rumourId: number): Rumour {
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

    if (!rumour)
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

function insertNew(rumour: NewRumour, userId: number) {

    if (stringIsNullOrWhiteSpace(rumour.rumour) || (typeof userId !== "number" && userId < 0))
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO 
            rumour(rumour, created_by) 
        VALUES (?, ?)
    `)
    stmt.run(rumour.rumour, userId)
    db.close();
}

function deleteItem(quoteId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            DELETE FROM 
                rumour
            WHERE rumour_id = ?;`
        )
        stmt.run(quoteId)
    })
    startTransaction()
    db.close()
}

function update(newRumour: Rumour) {
    const isInvalid = stringIsNullOrWhiteSpace(newRumour.rumour) || !newRumour.id || typeof newRumour.id !== "number"
    if (isInvalid)
        throw `Invalid data`

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            UPDATE 
                rumour
            SET
                rumour = ?
            WHERE rumour_id = ?`
        )
        stmt.run([newRumour.rumour, newRumour.id])
    })
    startTransaction()
    db.close()
}

export const rumourService = {
    get: get,
    getAll: getAll,
    insertNew: insertNew,
    delete: deleteItem,
    update: update
}