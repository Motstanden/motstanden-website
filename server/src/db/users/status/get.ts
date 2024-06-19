import Database, { Database as DatabaseType } from "better-sqlite3"
import { UserGroup, UserStatus } from "common/enums"
import { dbReadOnlyConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function getStatusId(status: UserStatus, existingDbConnection?: DatabaseType) {
    
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            user_status_id as id
        FROM 
            user_status
        WHERE 
            status = ?
    `)
    const result = <{id: number} | undefined> stmt.get(status.valueOf())

    if (!existingDbConnection) {
        db.close()
    }

    if(!result)
        throw new Error(`User status ${status} not found in the database`)

    return result.id
}