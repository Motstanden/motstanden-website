import Database, { Database as DatabaseType } from "better-sqlite3"
import { CommentEntityType, LikeEntityType, UserGroup, UserRank, UserStatus } from "common/enums"
import { DeactivatedUser } from "common/interfaces"
import { parentPort } from 'node:worker_threads'
import { dbReadWriteConfig, motstandenDB } from '../config/databaseConfig.js'
import { db as DB } from '../db/index.js'
import { dayjs } from "../lib/dayjs.js"
import { isMainModule } from '../utils/isMainModule.js'
import { sleepAsync } from '../utils/sleepAsync.js'

/**
 * Entry point for the job `deleteDeactivatedUsers`
 */
async function main() {

    const users = getUsersToDelete()
    if(users.length === 0) 
        return
    
    const errors: Error[] = []
    const onError = (err: unknown) => {
        const error = err instanceof Error ? err : new Error(String(err))
        errors.push(error)
    }

    const db = new Database(motstandenDB, dbReadWriteConfig)
    
    // Prepare users for deletion
    const preparedUsers: DeactivatedUser[] = [] 
    for(const user of users) { 
        try {
            markUserAsDeleted(db, user.id)
            DB.users.refreshTokens.deleteAllByUser(user.id, db)
            preparedUsers.push(user)
        } catch(err) { 
            onError(err)
            undoMarkUserAsDeleted(db, user.id)
        }
    }
    
    // Avoid race conditions by waiting for any pending writes to the user table to complete
    // In production, we will wait 15 minutes for the AccessToken to expire
    await sleepAsync(process.env.IS_DEV_ENV === "true" ? 2000 : 15 * 1000 * 60)

    for(const user of preparedUsers) { 
        
        // Delete all user-identifiable data
        let success = false
        try {
            deleteUser(db, user)
            success = true
        } catch(err) { 
            onError(err)
            undoMarkUserAsDeleted(db, user.id)
        }

        // TODO: Notify the user by mail
        if(success) {
            try {
                // TODO: Send email to user
            } catch(err) {
                onError(err)
            }
        }
    }
    db.close()

    if(errors.length > 0) {
        const errorMessages = errors.map((err, index) => `Error ${index + 1}:\n${err.message}`).join("\n\n")
        throw new Error(`Encountered ${errors.length} errors during deletion of deactivated users:\n\n${errorMessages}`)
    }
}

/**
 * Deletes all user-identifiable data for the given user
 */
function deleteUser(db: DatabaseType, user: DeactivatedUser) { 
    return db.transaction(() => { 
        anonymizeUser(db, user.id)

        deleteAllLikes(db, user.id)
        
        DB.comments.resetUnreadCount(user.id, db)
        deleteAllComments(db, user.id)

        DB.wallPosts.resetUnreadCount(user.id, db)
        DB.wallPosts.deleteAllByUser(user.id, db)
        DB.wallPosts.deleteAllOnWall(user.id, db)

        DB.events.participants.deleteAllByUser(user.id, db)

        DB.polls.votes.deleteAllBy(user.id, db)

        // TODO:
        //  - Delete all events created by the user
    })
}
/**
 * Gets all users that have been deactivated for more than 90 days
 */
function getUsersToDelete() {
    const deactivationPeriod = dayjs().utc().subtract(90, "days")
    const users = DB.users.getAllDeactivated()
        .filter(user => dayjs.utc(user.deactivatedAt).isBefore(deactivationPeriod))
    return users
}

/**
 * Sets the `is_deleted` flag to `1` for the user with the given `userId`
 */
function markUserAsDeleted(db: DatabaseType, userId: number) {
    const stmt = db.prepare(`
        UPDATE user SET
            is_deleted = 1 
        WHERE
            user_id = @userId
    `)
    stmt.run({ userId: userId })
}

function undoMarkUserAsDeleted(db: DatabaseType, userId: number) { 
    const stmt = db.prepare(`
        UPDATE user SET
            is_deleted = 0 
        WHERE
            user_id = @userId
    `)
    stmt.run({ userId: userId })
}

/**
 * For each property in the user table, sets the value to an empty or default value
 */
function anonymizeUser(db: DatabaseType, userId: number) { 

    const email = `${userId}@slettet-bruker.motstanden.no`    // Should pass UNIQUE NOT NULL email constraint
    const profilePic = 'files/private/profilbilder/boy.png'
    
    const rankId = DB.users.ranks.getId(UserRank.ShortCircuit, db)
    const statusId = DB.users.status.getId(UserStatus.Inactive, db)
    const groupId = DB.users.groups.getId(UserGroup.Contributor, db)
    
    const stmt = db.prepare(`
        UPDATE user SET
            first_name = '',
            middle_name = '',
            last_name = '',
            birth_date = NULL,
            email = @email,
            phone_number = NULL,
            profile_picture = @profilePic,

            cape_name = '',
            user_rank_id = @rankId,
            user_status_id = @statusId,
            start_date = DATE(created_at),
            end_date = NULL,

            user_group_id = @groupId
        WHERE
            user_id = @userId
    `)

    stmt.run({
        email: email,
        profilePic: profilePic,
        rankId: rankId,
        statusId: statusId,
        groupId: groupId,
        userId: userId,
    })
}

/**
 * Delete all likes by the user
 */
function deleteAllLikes(db: DatabaseType, userId: number) {
    const likeEntities = Object.values(LikeEntityType)
    for(const entity of likeEntities) {
        DB.likes.deleteAllByUser(entity, userId, db)
    }
}

/**
 * Delete all comments by the user
 */
function deleteAllComments(db: DatabaseType, userId: number) {
    const commentEntities = Object.values(CommentEntityType)
    for(const entity of commentEntities) {
        DB.comments.deleteAllByUser(entity, userId, db)
    }
}

if(isMainModule(import.meta.url)) {
    main()
    parentPort?.postMessage("done")
}

export {
    main as job
}

