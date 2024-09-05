import Database from "better-sqlite3"
import { UserStatus } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { userStatusDb } from "./status/index.js"

export function deactivateUser(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const statusId = userStatusDb.getId(UserStatus.Deactivated, db)
    const stmt = db.prepare(`
        UPDATE user SET
            is_deactivated = 1,
            user_status_id = @statusId
        WHERE
            user_id = @userId
    `)
    stmt.run({ 
        userId: userId, 
        statusId: statusId 
    })
    db.close()
}

export function activateUser(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const statusId = userStatusDb.getId(UserStatus.Active, db)
    const stmt = db.prepare(`
        UPDATE user SET
            is_deactivated = 0,
            user_status_id = @statusId
        WHERE
            user_id = @userId
    `)
    stmt.run({ 
        userId: userId,
        statusId: statusId
    })
    db.close()
}