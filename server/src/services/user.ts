import Database from "better-sqlite3";
import { dbReadOnlyConfig, motstandenDB } from "../config/databaseConfig";

function validateEmail(email: string): boolean {
    return true;    // #TODO
}

export function userExists(unsafeEmail: string | undefined): boolean {
    const email = unsafeEmail?.trim().toLowerCase();
    
    if(!email)
        return false

    if(!validateEmail(email))
        return false
    
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare("SELECT user_id FROM user WHERE email = ?")
    const dbUser = stmt.get(unsafeEmail)
    if(!dbUser)
        return false;

    return true;
}