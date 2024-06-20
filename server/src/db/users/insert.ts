import Database from "better-sqlite3"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { NewUser } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { userGroupsDb } from "./groups/index.js"
import { userRanksDb } from "./ranks/index.js"
import { userStatusDb } from "./status/index.js"


export function insertUser(user: NewUser): number | bigint {
    const db = new Database(motstandenDB, dbReadWriteConfig) // Read only instance of db

    // Default values
    const groupId = userGroupsDb.getId(UserGroup.Contributor, db)
    const rankId = userRanksDb.getId(UserRank.ShortCircuit, db)
    const statusId = userStatusDb.getId(UserStatus.Active, db)

    const stmt = db.prepare(`
        INSERT INTO user(
            first_name, 
            middle_name, 
            last_name, 
            email, 
            profile_picture,
            user_group_id, 
            user_rank_id, 
            user_status_id
        )
        VALUES ( 
            @firstName, 
            @middleName, 
            @lastName, 
            @email, 
            @profilePicture, 
            @groupId, 
            @rankId, 
            @statusId 
        )
    `)
    const result = stmt.run({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        groupId: groupId,
        rankId: rankId,
        statusId: statusId,
    })

    db.close()

    if (result.changes > 0)
        return result.lastInsertRowid
    else
        throw "Failed to update user"
}
