import Database, { Database as DatabaseType } from "better-sqlite3"
import { CommentEntityType, LikeEntityType, UserGroup, UserRank, UserStatus } from "common/enums"
import { DeactivatedUser } from "common/interfaces"
import { parentPort } from 'node:worker_threads'
import { dbReadWriteConfig, motstandenDB } from '../config/databaseConfig.js'
import { db as DB } from '../db/index.js'
import { dayjs } from "../lib/dayjs.js"
import { Mail } from "../services/mail.js"
import { ErrorLogger } from "../utils/ErrorLogger.js"
import { isMainModule } from '../utils/isMainModule.js'
import { mailTemplates } from "../utils/mailTemplateBuilders.js"
import { sleepAsync } from '../utils/sleepAsync.js'

/**
 * Entry point for the job `deleteDeactivatedUsers`
 */
async function main() {

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const errorLogger = new ErrorLogger()
    const users = getUsersToDelete()

    if(users.length === 0) {
        db.close()
        return
    }

    // 1. Lock the user from being changed by other processes
    for(const user of users) { 
        DB.users.refreshTokens.deleteAllByUser(user.id, db)         // Should not be necessary, but just in case
        markUserAsDeleted(db, user.id)
    }
    
    // 2. Wait for any pending writes to the user table to complete
    //    In production, wait 15 minutes just to be sure that all AccessTokens for the user has expired
    await sleepAsync(process.env.IS_DEV_ENV === "true" ? 2000 : 15 * 1000 * 60)

    // 3. Delete all user data, and notify the user by email
    for(const user of users) { 
        let success = tryDeleteUser(db, user, errorLogger)
        if(success) {
            await notifyUserByEmail(user, errorLogger)
        } else {
            undoMarkUserAsDeleted(db, user.id)
        }
    }

    db.close()
    if(errorLogger.hasErrors()) {
        throw new Error(errorLogger.message())
    }
}

/**
 * Runs the `deleteUser` function and logs any errors that occur.
 * @Returns `true` if the user was successfully deleted, otherwise `false`
 */
function tryDeleteUser(db: DatabaseType, user: DeactivatedUser, errorLogger: ErrorLogger) { 
    let success = false
    try {
        deleteUser(db, user)
        success = true
    } catch(err) { 
        errorLogger.log(err)
    }
    return success
}

/**
 * Notifies the user by mail that their account has been deleted
 */
async function notifyUserByEmail(user: DeactivatedUser, errorLogger: ErrorLogger) { 
    try {
        const html = await mailTemplates.buildDeletedUserHtml()
        await Mail.send({
            to: user.email,
            subject: "Din bruker er slettet",
            html: html
        })
    } catch(err) {
        errorLogger.log(err)
    }
}

/**
 * Deletes all user-identifiable data for the given user
 */
function deleteUser(db: DatabaseType, user: DeactivatedUser) { 
    const transaction = db.transaction(() => { 
        anonymizeUser(db, user.id)

        deleteAllLikes(db, user.id)
        
        DB.comments.resetUnreadCount(user.id, db)
        deleteAllComments(db, user.id)

        DB.wallPosts.resetUnreadCount(user.id, db)
        DB.wallPosts.deleteAllByUser(user.id, db)
        DB.wallPosts.deleteAllOnWall(user.id, db)

        DB.events.participants.deleteAllByUser(user.id, db)
        DB.events.deleteAllByAuthor(user.id, db)

        DB.polls.votes.deleteAllBy(user.id, db)

        // TODO:
        //  - Delete all events created by the user
    })
    transaction()
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
    const statusId = DB.users.status.getId(UserStatus.Deactivated, db)
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

