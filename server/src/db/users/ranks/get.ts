import Database, { Database as DatabaseType } from "better-sqlite3"
import { UserGroup, UserRank } from "common/enums"
import { dbReadOnlyConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function getUserRankId(rank: UserRank, existingDbConnection?: DatabaseType) {
    
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            user_rank_id as id
        FROM 
            user_rank
        WHERE 
            name = ?
    `)
    const result = <{id: number} | undefined> stmt.get(rank.valueOf())

    if (!existingDbConnection) {
        db.close()
    }

    if(!result)
        throw new Error(`User rank ${rank} not found in the database`)

    return result.id
}