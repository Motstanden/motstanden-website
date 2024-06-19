import Database, { Database as DatabaseType } from "better-sqlite3"
import { UserEditMode, UserGroup, UserRank, UserStatus } from "common/enums"
import { NewUser, User, UserReference } from "common/interfaces"
import { isNtnuMail, isNullOrWhitespace } from "common/utils"
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import { AccessTokenData } from "../../ts/interfaces/AccessTokenData.js"
import { userGroupsDb } from "./groups/index.js"
import { userRanksDb } from "./ranks/index.js"
import { userStatusDb } from "./status/index.js"

export function userExists(unsafeEmail: string | undefined): boolean {
    const email = unsafeEmail?.trim().toLowerCase();

    if (isNullOrWhitespace(email))
        return false

    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id
        FROM 
            user 
        WHERE email = ?`)
    const user = stmt.get(email)
    db.close()

    if (!user)
        return false;

    return true;
}

export function getAccessTokenData(unsafeEmail: string): AccessTokenData {
    const email = unsafeEmail?.trim().toLowerCase();

    if (isNullOrWhitespace(email))
        throw `The email is invalid.`

    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as userId,
            email,
            user_group_id as groupId,
            user_group as groupName
        FROM 
            vw_user 
        WHERE email = ?`)
    const user = <AccessTokenData | undefined> stmt.get(unsafeEmail)
    db.close()

    if (!user)
        throw `The user does not exist in the database`

    return user
}

export function getUser(id: number): User {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as id,
            email,
            user_group_id as groupId,
            user_group as groupName,
            user_rank as rank,
            first_name as firstName,
            middle_name as middleName,
            last_name as lastName,
            user_status as status,
            cape_name as capeName,
            phone_number as phoneNumber,
            birth_date as birthDate,
            profile_picture as profilePicture,
            start_date as startDate,
            end_date as endDate,
            created_at as createdAt,
            updated_at as updatedAt
        FROM 
            vw_user 
        WHERE user_id = ?`)
    const user = stmt.get(id) as User
    db.close()

    if (!user)
        throw "User not found"

    return user
}

export function getAllUsers(): User[] {

    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as id,
            email,
            user_group_id as groupId,
            user_group as groupName,
            user_rank as rank,
            first_name as firstName,
            middle_name as middleName,
            last_name as lastName,
            user_status as status,
            cape_name as capeName,
            phone_number as phoneNumber,
            birth_date as birthDate,
            profile_picture as profilePicture,
            start_date as startDate,
            end_date as endDate,
            created_at as createdAt,
            updated_at as updatedAt
        FROM 
            vw_user 
        ORDER BY 
            first_name COLLATE NOCASE ASC`)
    const user = stmt.all() as User[]
    db.close()

    return user
}

export function getAllUsersSimplified(): UserReference[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as id,
            full_name as fullName,
            SUBSTR(first_name, 1, 1) || SUBSTR(last_name, 1, 1) AS initials,
            CASE 
                WHEN COUNT(first_name) OVER (PARTITION BY first_name) > 1 THEN 
                    first_name || ' ' || SUBSTR(last_name, 1, 1) || '.'
                ELSE first_name
            END AS shortFullName
        FROM 
            user;`)
    const user = stmt.all() as UserReference[]
    db.close()
    return user   
}

export function createUser(user: NewUser): number | bigint {
    const dbRd = new Database(motstandenDB, dbReadOnlyConfig)   // Read only instance of db

    // Throws exceptions if not found
    const groupId = userGroupsDb.getId(UserGroup.Contributor, dbRd)
    const rankId = userRanksDb.getId(UserRank.ShortCircuit, dbRd)
    const statusId = userStatusDb.getId(UserStatus.Active, dbRd)
    dbRd.close()

    const dbWr = new Database(motstandenDB, dbReadWriteConfig)  // Read/Write instance of db

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
            "",     // cape name
            null,   // Phone number
            null,   // Birth date
            statusId,
            null    // End date
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

function isValidDate(dateStr: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
}

function makeValidUser(user: User): User | undefined {

    if (
        isNullOrWhitespace(user.email) ||
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
        (user.birthDate && !isValidDate(user.birthDate))
    ) {
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


    const db = new Database(motstandenDB, dbReadWriteConfig)  // Read/Write instance of db
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

    const db = new Database(motstandenDB, dbReadOnlyConfig)   // Read only instance of db
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
    stmt: string,
    params: any[]
}