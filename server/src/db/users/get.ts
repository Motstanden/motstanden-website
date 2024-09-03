import Database, { Database as DatabaseType } from "better-sqlite3"
import { DeactivatedUser, DeletedUser, User, UserIdentity } from "common/interfaces"
import { isNullOrWhitespace } from "common/utils"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

const userProps = `
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
`

export function getUser(id: number): User | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            ${userProps}
        FROM 
            vw_user 
        WHERE 
            user_id = @userId 
            AND is_deactivated = 0 
            AND is_deleted = 0
    `)
    const user = stmt.get({userId: id}) as User | undefined
    db.close()
    return user
}
export function getUserByMail(email: string): User | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            ${userProps}
        FROM 
            vw_user 
        WHERE 
            email = @email 
            AND is_deactivated = 0 
            AND is_deleted = 0
    `)
    const user = stmt.get({email: email}) as User | undefined
    db.close()
    return user
}


export function getDeactivatedUser(id: number): DeactivatedUser | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            ${userProps},
            deactivated_at as deactivatedAt
        FROM 
            vw_user 
        WHERE 
            user_id = @userId 
            AND is_deactivated = 1 
            AND is_deleted = 0
    `)
    const user = stmt.get({userId: id}) as DeactivatedUser | undefined
    db.close()
    return user
}

export function getDeletedUser(id: number): DeletedUser | undefined { 

    if(process.env.IS_DEV_ENV !== "true") {
        throw new Error("This function is only intended to be used in development. It should not be exposed to the production API")
    }

    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            ${userProps},
            deactivated_at as deactivatedAt,
            deleted_at as deletedAt
        FROM 
            vw_user 
        WHERE 
            user_id = @userId 
            AND is_deactivated = 1 
            AND is_deleted = 1
    `)
    const user = stmt.get({userId: id}) as DeletedUser | undefined
    db.close()
    return user
}

export function getAllUsers(): User[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            ${userProps}
        FROM 
            vw_user
        WHERE
            is_deactivated = 0 AND is_deleted = 0 
        ORDER BY 
            first_name COLLATE NOCASE ASC
    `)
    const user = stmt.all() as User[]
    db.close()
    return user
}

export function getAllDeactivatedUsers(): DeactivatedUser[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(
        `SELECT 
            ${userProps},
            deactivated_at as deactivatedAt
        FROM 
            vw_user
        WHERE
            is_deactivated = 1 AND is_deleted = 0 
        ORDER BY 
            first_name COLLATE NOCASE ASC
    `)
    const user = stmt.all() as DeactivatedUser[]
    db.close()
    return user
}

export function getAllUserIds(existingDbConnection?: DatabaseType): { id: number }[] { 
    const db = existingDbConnection ?? new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT
            user_id as id
        FROM
            user
        WHERE
            is_deactivated = 0 AND is_deleted = 0
    `)
    const userIds = stmt.all() as { id: number} []

    if (!existingDbConnection) {
        db.close()
    }

    return userIds
}

export function getAllUsersAsIdentifiers(): UserIdentity[] {
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
            user
        WHERE
            is_deactivated = 0 AND is_deleted = 0
        `)
    const user = stmt.all() as UserIdentity[]
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
        WHERE 
            email = ? AND is_deactivated = 0 AND is_deleted = 0
        `)
    const user = stmt.get(email)
    db.close()

    return !!user
}