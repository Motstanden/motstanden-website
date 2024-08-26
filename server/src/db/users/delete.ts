import Database, { Database as DatabaseType } from "better-sqlite3"
import { UserGroup, UserStatus } from "common/enums"
import { NewUser } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { db as DB } from "../index.js"
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

        DB.comments.resetUnreadCount(userId, db)
        DB.wallPosts.resetUnreadCount(userId, db)
     
        DB.users.refreshTokens.deleteAllMatches(userId, db)     // Log user out of all devices
        
        // TODO: Delete more ?
    })
    transaction()
    db.close()
}

export function undoSoftDeleteUser(userId: number, newUserData: NewUser) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    // Default values
    const groupId = userGroupsDb.getId(UserGroup.Contributor, db)
    const statusId = userStatusDb.getId(UserStatus.Active, db)

    const stmt = db.prepare(`
        UPDATE user SET
            first_name = @firstName,
            middle_name = @middleName,
            last_name = @lastName,
            email = @email,
            profile_picture = @profilePicture,
            user_status_id = @statusId,
            user_group_id = @groupId,
            is_deleted = 0
        WHERE
            user_id = @userId
    `)
    stmt.run({
        userId: userId,
        firstName: newUserData.firstName,
        middleName: newUserData.middleName,
        lastName: newUserData.lastName,
        email: newUserData.email,
        profilePicture: newUserData.profilePicture,
        statusId: statusId,
        groupId: groupId,
    })
    db.close()
}