import Database from "better-sqlite3"
import { Rumour } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"
import { AuthoredItem } from "../../ts/interfaces/AuthoredItem.js"

export function getRumourAuthorInfo(rumourId: number): AuthoredItem | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            rumour_id as id, 
            created_by as createdBy
        FROM 
            rumour 
        WHERE rumour_id = ?
    `)
    const rumour = <AuthoredItem | undefined>stmt.get(rumourId)
    db.close()
    return rumour
}

type DbRumour = Omit<Rumour, "isCreatedByCurrentUser"> & { 
    isCreatedByCurrentUser: number 
}

export function getAll({
    limit,
    currentUserId,
}: {
    currentUserId: number
    limit?: number,
}): Rumour[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            rumour_id as id, 
            rumour, 
            CASE 
                WHEN created_by = @currentUserId 
                    THEN 1 
                ELSE 0 
            END as isCreatedByCurrentUser,
            created_at as createdAt,
            updated_at as updatedAt 
        FROM 
            rumour 
        ORDER BY 
            rumour_id DESC
        ${!!limit ? "LIMIT @limit" : ""}
    `)
    // const rumours = !!limit ? stmt.all(limit) : stmt.all()
    const dbResult = stmt.all({ 
        currentUserId: currentUserId,
        limit: limit 
    }) as DbRumour[]
    const rumours = dbResult.map(rumour => ({ 
        ...rumour, 
        isCreatedByCurrentUser: rumour.isCreatedByCurrentUser === 1 
    }))
    db.close()
    return rumours
}
