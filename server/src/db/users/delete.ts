import Database, { Database as DatabaseType } from "better-sqlite3"
import { UserGroup, UserStatus } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { userGroupsDb } from "./groups/index.js"
import { userStatusDb } from "./status/index.js"

function anonymizeUser(userId: number, db: DatabaseType) {

    const newMail = `${userId}@slettet-bruker.motstanden.no`    // Should pass UNIQUE NOT NULL email constraint
    const statusId = userStatusDb.getId(UserStatus.Inactive, db)
    const groupId = userGroupsDb.getId(UserGroup.Contributor, db)
    const profilePic = 'files/private/profilbilder/boy.png'

    // Reset all fields except
    //  - user_rank_id
    //  - cape_name
    //  - start_date
    //  - end_date
    //  - created_at
    //  - updated_at
    const stmt = db.prepare(`
        UPDATE user SET
            user_group_id = @groupId,
            email = @email,
            first_name = '',
            middle_name = '',
            last_name = '',
            phone_number = NULL,
            birth_date = NULL,
            user_status_id = @statusId,
            profile_picture = @profilePic
        WHERE
            user_id = @userId
    `)

    stmt.run({
        groupId: groupId,
        email: newMail,
        statusId: statusId,
        profilePic: profilePic,
        userId: userId,
    })
}

function deactivateUser(userId: number, db: DatabaseType) { 
    const stmt = db.prepare(`
        UPDATE user SET
            is_deleted = 1 
        WHERE
            user_id = @userId
    `)
    stmt.run({ userId: userId })
}

export function softDeleteUser(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const transaction = db.transaction(() => {
        anonymizeUser(userId, db)
        deactivateUser(userId, db)
        
        // TODO: Delete more ?
    })
    transaction()
    db.close()
}