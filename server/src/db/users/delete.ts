import Database, { Database as DatabaseType } from "better-sqlite3";
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js";

function softDeleteUser(userId: number, db: DatabaseType) {

    const newMail = `${userId}@slettet-bruker.motstanden.no`    // Should pass UNIQUE NOT NULL email constraint
    const newUserStatus = 4                                     // Hardcoded id for inactive status 
    
    // Reset all fields except
    //  - user_rank_id
    //  - cape_name
    //  - start_date
    //  - end_date
    //  - created_at
    //  - updated_at
    const stmt = db.prepare(`
        UPDATE user
        SET
            user_group_id = DEFAULT,
            email = @email,
            first_name = '',
            middle_name = '',
            last_name = '',
            phone_number = NULL,
            birth_date = NULL,
            user_status_id = @userStatus,
            profile_picture = DEFAULT,
            is_deleted = 1
        WHERE
            id = @userId
    `)

    stmt.run({
        userId: userId,
        email: newMail,
        userStatus: newUserStatus,
    })
}

function deleteUserData(userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const transaction = db.transaction(() => {
        softDeleteUser(userId, db)

        // TODO: Delete more ?

    })
    transaction()
    db.close()
}