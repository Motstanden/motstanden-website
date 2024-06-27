import Database, { Database as DatabaseType } from "better-sqlite3"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { User } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { userGroupsDb } from "./groups/index.js"
import { userRanksDb } from "./ranks/index.js"
import { userStatusDb } from "./status/index.js"

export interface UpdatableUserFields extends Pick<User, 
    "firstName" | 
    "middleName" | 
    "lastName" | 
    "email" |
    "groupName" |
    "rank" |
    "capeName" |
    "status" |
    "phoneNumber" |
    "birthDate" |
    "startDate" |
    "endDate" 
> {}

export function updateUser(userId: number, user: Partial<UpdatableUserFields>) {

    const db = new Database(motstandenDB, dbReadWriteConfig)

    const groupId = getGroupId(user.groupName, db)
    const rankId = getRankId(user.rank, db)
    const statusId = getStatusId(user.status, db)

    const setClause = concatClauses([
        { value: user.firstName,    clause: `first_name = @firstName` },
        { value: user.middleName,   clause: `middle_name = @middleName` },
        { value: user.lastName,     clause: `last_name = @lastName` },
        { value: user.email,        clause: `email = @email` },
        { value: groupId,           clause: `user_group_id = @groupId` },
        { value: rankId,            clause: `user_rank_id = @rankId` },
        { value: user.capeName,     clause: `cape_name = @capeName` },
        { value: statusId,          clause: `user_status_id = @statusId` },
        { value: user.phoneNumber,  clause: `phone_number = @phoneNumber` },
        { value: user.birthDate,    clause: `birth_date = @birthDate` },
        { value: user.startDate,    clause: `start_date = @startDate` },
        { value: user.endDate,      clause: `end_date = @endDate` }
    ])

    const stmt = db.prepare(`
        UPDATE 
            user
        SET
            ${setClause}
        WHERE
            user_id = @userId
    `)

    stmt.run({
        userId: userId,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        groupId: groupId,
        rankId: rankId,
        capeName: user.capeName,
        statusId: statusId,
        phoneNumber: user.phoneNumber,
        birthDate: user.birthDate,
        startDate: user.startDate,
        endDate: user.endDate
    })
}

/**
 * For each defined value, concatenate clauses and delimit them by a comma
 * @param items Array of {value, clause} objects.
 * @returns A string of concatenated clauses separated by a comma
 */
function concatClauses( items: { value: any | undefined, clause: string}[] ): string {
    return items
        .filter(item => item.value !== undefined)
        .map(item => item.clause)
        .join(", ")
}

function getRankId(rank: UserRank | undefined, db?: DatabaseType): number | undefined {

    if(rank === undefined)
        return undefined

    return userRanksDb.getId(rank, db)
}

function getGroupId(group: UserGroup | undefined, db?: DatabaseType): number | undefined {

    if(group === undefined)
        return undefined

    return userGroupsDb.getId(group, db)
}

function getStatusId(status: UserStatus | undefined, db?: DatabaseType): number | undefined {

    if(status === undefined)
        return undefined

    return userStatusDb.getId(status, db)
}