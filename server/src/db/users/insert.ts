import Database from "better-sqlite3"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { NewUser } from "common/interfaces"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { userGroupsDb } from "./groups/index.js"
import { userRanksDb } from "./ranks/index.js"
import { userStatusDb } from "./status/index.js"


export function insertUser(user: NewUser): number | bigint {
    const dbRd = new Database(motstandenDB, dbReadOnlyConfig) // Read only instance of db


    // Throws exceptions if not found
    const groupId = userGroupsDb.getId(UserGroup.Contributor, dbRd)
    const rankId = userRanksDb.getId(UserRank.ShortCircuit, dbRd)
    const statusId = userStatusDb.getId(UserStatus.Active, dbRd)
    dbRd.close()

    const dbWr = new Database(motstandenDB, dbReadWriteConfig) // Read/Write instance of db


    // Define transaction
    let result: Database.RunResult | undefined
    const startTransaction = dbWr.transaction(() => {
        const stmt = dbWr.prepare(`
            INSERT INTO user(
                user_group_id, 
                user_rank_id, 
                email, 
                first_name, 
                middle_name, 
                last_name, 
                profile_picture,
                cape_name,
                phone_number,
                birth_date,
                user_status_id,
                end_date
            )
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        result = stmt.run(
            groupId,
            rankId,
            user.email,
            user.firstName,
            user.middleName,
            user.lastName,
            user.profilePicture,
            "", // cape name
            null, // Phone number
            null, // Birth date
            statusId,
            null // End date
        )
    })

    // Run transaction
    startTransaction()
    dbWr.close()

    if (result && result.changes > 0)
        return result.lastInsertRowid

    else
        throw "something went wrong"

}
