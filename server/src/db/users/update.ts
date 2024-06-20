import Database from "better-sqlite3"
import { UserEditMode, UserGroup, UserStatus } from "common/enums"
import { User } from "common/interfaces"
import { isNtnuMail, isNullOrWhitespace } from "common/utils"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { userGroupsDb } from "./groups/index.js"
import { userRanksDb } from "./ranks/index.js"
import { userStatusDb } from "./status/index.js"

function isValidDate(dateStr: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
}

function makeValidUser(user: User): User | undefined {

    if (isNullOrWhitespace(user.email) ||
        isNtnuMail(user.email) ||
        !user.groupName ||
        !user.rank ||
        isNullOrWhitespace(user.firstName) ||
        isNullOrWhitespace(user.lastName) ||
        !user.status ||
        isNullOrWhitespace(user.startDate) ||
        !isValidDate(user.startDate) ||
        (user.endDate && !isValidDate(user.endDate)) ||
        (user.phoneNumber && !(user.phoneNumber >= 10000000 || user.phoneNumber <= 99999999)) ||
        (user.birthDate && !isValidDate(user.birthDate))) {
        return undefined
    }

    return {
        ...user,
        email: user.email.trim(),
        firstName: user.firstName.trim(),
        middleName: user.middleName.trim(),
        lastName: user.lastName.trim(),
        capeName: user.capeName.trim(),
        startDate: user.startDate.trim(),
        endDate: user.endDate?.trim() ?? null,
        birthDate: user.birthDate?.trim() ?? null
    }
}


export function updateUser(newUser: User, updateMode: UserEditMode) {

    const validUser = makeValidUser(newUser)

    if (!validUser)
        throw "Invalid data"

    if (validUser.status === UserStatus.Inactive && updateMode === UserEditMode.Self)
        throw "Invalid data"

    if (validUser.groupName === UserGroup.SuperAdministrator && updateMode !== UserEditMode.SuperAdmin)
        throw "Invalid data"

    if (validUser.groupName !== UserGroup.Contributor && updateMode === UserEditMode.Self)
        throw "Invalid data"


    const db = new Database(motstandenDB, dbReadWriteConfig) // Read/Write instance of db
    const sql = getUpdateUserSql(validUser, updateMode)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(sql.stmt)
        const info = stmt.run(sql.params)
    })
    startTransaction()
    db.close()

}

// This assumes that values are validated for the given user group.
function getUpdateUserSql(user: User, updateMode: UserEditMode): SqlHelper {

    const db = new Database(motstandenDB, dbReadOnlyConfig) // Read only instance of db
    const groupId = userGroupsDb.getId(user.groupName, db)
    const rankId = userRanksDb.getId(user.rank, db)
    const statusId = userStatusDb.getId(user.status, db)
    db.close()

    const selfDefault: SqlHelper = {
        stmt: `
            first_name = ?,
            middle_name = ?,
            last_name = ?,
            birth_date = ?,
            email = ?,
            phone_number = ?,
            cape_name = ?,
            user_status_id = ?,
            start_date = ?,
            end_date = ?
        `,
        params: [
            user.firstName,
            user.middleName,
            user.lastName,
            user.birthDate,
            user.email,
            user.phoneNumber,
            user.capeName,
            statusId,
            user.startDate,
            user.endDate
        ]
    }

    const superAdminOrSelfAdmin = {
        stmt: `
            UPDATE 
                user
            SET
                ${selfDefault.stmt},
                user_rank_id = ?,
                user_group_id = ?
            WHERE user_id = ?
        `,
        params: [
            ...selfDefault.params,
            rankId,
            groupId,
            user.id
        ]
    }

    switch (updateMode) {
        case UserEditMode.Self:
            return {
                stmt: `
                UPDATE 
                    user
                SET
                    ${selfDefault.stmt}
                WHERE user_id = ?
                `,
                params: [
                    ...selfDefault.params,
                    user.id,
                ]
            }
        case UserEditMode.Admin:
            return {
                stmt: `
                UPDATE 
                    user
                SET
                    cape_name = ?,
                    user_rank_id = ?,
                    user_status_id = ?,
                    start_date = ?,
                    end_date = ?,
                    user_group_id = ?
                WHERE user_id = ?
                `,
                params: [
                    user.capeName,
                    rankId,
                    statusId,
                    user.startDate,
                    user.endDate,
                    groupId,
                    user.id
                ]
            }
        case UserEditMode.SelfAndAdmin: return superAdminOrSelfAdmin
        case UserEditMode.SuperAdmin: return superAdminOrSelfAdmin
    }
}
interface SqlHelper {
    stmt: string
    params: any[]
}
