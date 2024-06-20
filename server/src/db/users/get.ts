import Database from "better-sqlite3"
import { User, UserReference } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

export function getUser(id: number): User | undefined {
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

export function getAllAsUserReference(): UserReference[] {
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

export function userExists(unsafeEmail: string | undefined): boolean {
    const email = unsafeEmail?.trim().toLowerCase()

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

    return !!user
}

export function getUserByMail(email: string): User | undefined {
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
        WHERE email = ?`)
    const user = <User | undefined>stmt.get(email)
    db.close()
    return user
}

