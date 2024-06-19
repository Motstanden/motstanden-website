import Database, { Database as DatabaseType} from "better-sqlite3"
import { UserGroup } from "common/enums"
import { dbReadOnlyConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function getUserGroupId(group: UserGroup, existingDbConnection?: DatabaseType) {
    
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            user_group_id as id
        FROM 
            user_group
        WHERE 
            name = ?
    `)
    const result = <{id: number} | undefined> stmt.get(group.valueOf())

    if (!existingDbConnection) {
        db.close()
    }

    if(!result)
        throw new Error(`User group ${group} not found in the database`)

    return result.id
}