import Database from "better-sqlite3";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import { User } from "common/interfaces";

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
    if(!user)
        throw `The user does not exist in the database`
    
    const accessToken = user as AccessTokenData;
    if(!accessToken.userId || !accessToken.email || !accessToken.groupId || !accessToken.groupName)
        throw `Database yielded invalid result.`

    return accessToken 
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
            profile_picture as profilePicture
        FROM 
            vw_user 
        WHERE user_id = ?`)
    const user = stmt.get(userToken.userId) as User

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
            profile_picture as profilePicture
        FROM 
            vw_user 
        ORDER BY 
            first_name ASC`)
    const user = stmt.all() as User[]

    return user
} 