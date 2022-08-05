import Database from "better-sqlite3";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig";
import { UserGroup } from "../ts/enums/UserGroup";
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";

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
        throw `The email is invalid: "${email}"`
    
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
        throw `Querying database for "${email}" yielded invalid result.`

    return accessToken 
}