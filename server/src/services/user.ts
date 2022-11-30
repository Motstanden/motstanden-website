import Database, { Database as DatabaseType } from "better-sqlite3";
import { UserEditMode, UserGroup, UserRank, UserStatus } from "common/enums";
import { NewUser, User } from "common/interfaces";
import { isNtnuMail, isNullOrWhitespace, validateEmail } from "common/utils";
import jwt from 'jsonwebtoken';
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"
import { JwtTokenData } from "../middleware/jwtAuthenticate.js"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"

export function userExists(unsafeEmail: string | undefined): boolean {
    const email = unsafeEmail?.trim().toLowerCase();

    if (!email || !validateEmail(email))
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

    if (!email || !validateEmail(email))
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
    const user = stmt.get(unsafeEmail)
    db.close()

    if (!user)
        throw `The user does not exist in the database`

    const accessToken = user as AccessTokenData;
    if (!accessToken.userId || !accessToken.email || !accessToken.groupId || !accessToken.groupName)
        throw `Database yielded invalid result.`

    return accessToken
}

export function getTokenDataFromId(userId: number): AccessTokenData {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as userId,
            email,
            user_group_id as groupId,
            user_group as groupName
        FROM 
            vw_user 
        WHERE user_id = ?`)
    const user = stmt.get(userId) as AccessTokenData
    db.close()

    if (!user.userId || !user.email || !user.groupId || !user.groupName)
        throw `Database yielded invalid result.`

    return user
}

export function insertLoginToken(refreshToken: string) {
    const jwtPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtTokenData

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(
        `INSERT INTO 
            login_token(user_id, token, issued_at, expire_at)
        VALUES 
            (?, ?, ?, ?)   
        `
    )
    const info = stmt.run(jwtPayload.userId, refreshToken, jwtPayload.iat, jwtPayload.exp)
    db.close()
}

export function verifyLoginToken(loginToken: string, userId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT
            token
        FROM 
            login_token
        WHERE user_id = ?
        `
    )
    const tokens = stmt.all(userId)
    db.close()
    const tokenMatch = tokens.find(item => item.token === loginToken)
    return !!tokenMatch
}

export function removeLoginToken(loginToken: string) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(
        `DELETE FROM
            login_token
        WHERE token = ?`
    )
    const info = stmt.run(loginToken)
    db.close()
}

export function removeAllLoginTokens(user: AccessTokenData) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(
        `DELETE FROM
            login_token
        WHERE user_id = ?`
    )
    const info = stmt.run(user.userId)
    db.close()
}

export function getUserData(userToken: AccessTokenData): User {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as userId,
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
    const user = stmt.get(userToken.userId) as User
    db.close()

    if (!user || user.email !== userToken.email)
        throw `Database yielded invalid result.`

    return user
}

export function getAllUsers(): User[] {

    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            user_id as userId,
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
            first_name ASC`)
    const user = stmt.all() as User[]
    db.close()

    return user
}

export function createUser(user: NewUser): number | bigint {
    const dbRd = new Database(motstandenDB, dbReadOnlyConfig)   // Read only instance of db

    // Throws exceptions if not found
    const groupId = getGroupId(user.groupName, dbRd)
    const rankId = getRankId(user.rank, dbRd)
    const statusId = getUserStatusId(user.status, dbRd)
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
                start_date,
                end_date
            )
            VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        result = stmt.run(
            groupId,
            rankId,
            user.email,
            user.firstName,
            user.middleName,
            user.lastName,
            user.profilePicture,
            user.capeName ?? "",
            user.phoneNumber ?? null,
            user.birthDate ?? null,
            statusId,
            user.startDate,
            user.endDate ?? null
        )
    })

    // Run transaction
    startTransaction()
    dbWr.close()

    console.log("Result", result, result?.lastInsertRowid)
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
        !validateEmail(user.email) ||
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
    const groupId = getGroupId(user.groupName, db)
    const rankId = getRankId(user.rank, db)
    const statusId = getUserStatusId(user.status, db)
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
            user.userId
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
                    user.userId,
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
                    user.userId
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



function getGroupId(group: UserGroup, db?: DatabaseType): number {
    return dangerouslyGetStringEnumId(
        group,
        {
            __dangerousTableName: "user_group",
            __dangerousColumnName: "name"
        },
        db
    )
}

function getRankId(rank: UserRank, db?: DatabaseType): number {
    return dangerouslyGetStringEnumId(
        rank,
        {
            __dangerousTableName: "user_rank",
            __dangerousColumnName: "name"
        },
        db
    )
}

function getUserStatusId(status: UserStatus, db?: DatabaseType): number {
    return dangerouslyGetStringEnumId(
        status,
        {
            __dangerousTableName: "user_status",
            __dangerousColumnName: "status"
        },
        db
    )
}

// ---------------------------------------------------------
//                      WARNING
// ---------------------------------------------------------
// This method is super dangerous to use because it is vulnerable to sql injections attacks.
// USE WITH GREAT CAUTION!
function dangerouslyGetStringEnumId(
    strEnum: StrEnum,
    dangerousInput: DangerousInput,
    db?: DatabaseType): number {
    db = db ?? new Database(motstandenDB, dbReadOnlyConfig)

    const tableName = dangerousInput.__dangerousTableName
    const columnName = dangerousInput.__dangerousColumnName
    const stmt = db.prepare(`
        SELECT 
            ${tableName}_id as id`      // DANGER!!!!
        + `  FROM 
            ${tableName}`               // DANGER!!!!
        + `  WHERE 
            ${columnName} = ?`         // DANGER!!!!
    )
    const dbResult = stmt.get(strEnum.valueOf())
    if (!dbResult)
        throw `Failed to retrieve value from database`
    return dbResult.id
}

interface StrEnum {
    valueOf(): string
}

interface DangerousInput {
    __dangerousTableName: string,
    __dangerousColumnName: string
}