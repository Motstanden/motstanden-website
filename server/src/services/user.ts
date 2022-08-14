import Database, {Database as DatabaseType} from "better-sqlite3";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import { NewUser, User } from "common/interfaces";
import { UserGroup, UserRank, UserStatus } from "common/enums";
import { JwtTokenData } from "../middleware/jwtAuthenticate";
import jwt from 'jsonwebtoken';

function validateEmail(email: string): boolean {
    return true;    // #TODO
}

export function userExists(unsafeEmail: string | undefined): boolean {
    const email = unsafeEmail?.trim().toLowerCase();
    
    if(!email || !validateEmail(email))
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
    
    if(!user)
        return false;

    return true;
}

export function getTokenData(unsafeEmail: string): AccessTokenData {
    const email = unsafeEmail?.trim().toLowerCase();
    
    if(!email || !validateEmail(email))
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

    if(!user)
        throw `The user does not exist in the database`
    
    const accessToken = user as AccessTokenData;
    if(!accessToken.userId || !accessToken.email || !accessToken.groupId || !accessToken.groupName)
        throw `Database yielded invalid result.`

    return accessToken 
}

export function insertLoginToken(refreshToken: string){
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

export function verifyLoginToken(loginToken: string, userToken: AccessTokenData): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT
            token
        FROM 
            login_token
        WHERE user_id = ?
        `
    )
    const tokens = stmt.all(userToken.userId)
    db.close()
    const tokenMatch = tokens.find( item => item.token === loginToken)
    return !!tokenMatch
}

export function removeLoginToken(loginToken: string){
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(
        `DELETE FROM
            login_token
        WHERE token = ?`
    )
    const info = stmt.run(loginToken)
    db.close()
}

export function removeAllLoginTokens(user: AccessTokenData){
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

    if(!user || user.email !== userToken.email)
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

export function createUser(user: NewUser) {
    const dbRd = new Database(motstandenDB, dbReadOnlyConfig)   // Read only instance of db

    // Throws exceptions if not found
    const groupId = getGroupId(user.groupName, dbRd)
    const rankId = getRankId(user.rank, dbRd)
    const statusId = getUserStatusId(user.status, dbRd)
    dbRd.close()

    const dbWr = new Database(motstandenDB, dbReadWriteConfig)  // Read/Write instance of db

    // Define transaction
    const startTransaction = dbWr.transaction( () => {
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
        const info = stmt.run(
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
    db?: DatabaseType) : number 
{
    db = db ?? new Database(motstandenDB, dbReadOnlyConfig)

    const tableName = dangerousInput.__dangerousTableName
    const columnName = dangerousInput.__dangerousColumnName
    const stmt = db.prepare(`
        SELECT 
            ${tableName}_id as id`      // DANGER!!!!
    +`  FROM 
            ${tableName}`               // DANGER!!!!
    +`  WHERE 
            ${columnName} = ?`         // DANGER!!!!
        )
    const dbResult = stmt.get(strEnum.valueOf())
    if(!dbResult)
        throw `Failed to retrieve value from database`
    return dbResult.id
}

interface StrEnum {
    valueOf (): string 
}

interface DangerousInput {
    __dangerousTableName: string,
    __dangerousColumnName: string
}