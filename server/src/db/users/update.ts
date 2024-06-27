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

    const setClauses: string[] = []

    const addSetClause = (value: any | undefined, clause: string) => {
        if(value !== undefined) {
            setClauses.push(clause)
        }
    }

    addSetClause(user.firstName, `first_name = @firstName`)
    addSetClause(user.middleName, `middle_name = @middleName`)
    addSetClause(user.lastName, `last_name = @lastName`)
    addSetClause(user.email, `email = @email`)
    addSetClause(groupId, `user_group_id = @groupId`)
    addSetClause(rankId, `user_rank_id = @rankId`)
    addSetClause(user.capeName, `cape_name = @capeName`)
    addSetClause(statusId, `user_status_id = @statusId`)
    addSetClause(user.phoneNumber, `phone_number = @phoneNumber`)
    addSetClause(user.birthDate, `birth_date = @birthDate`)    
    addSetClause(user.startDate, `start_date = @startDate`)
    addSetClause(user.endDate, `end_date = @endDate`)

    const stmt = db.prepare(`
        UPDATE 
            user
        SET
            ${setClauses.join(', ')}
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