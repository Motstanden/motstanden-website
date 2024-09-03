import Database, { Database as DatabaseType } from "better-sqlite3"
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
    
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const transaction = db.transaction(async () => { 

        for (const user of users) {
            markUserAsDeleted(db, user.id)
        }

        // Avoid race conditions by waiting for any pending writes to the user table to finish
        await sleepAsync( process.env.IS_DEV_ENV === "true" ? 2000 : 30 * 1000)

        // TODO:
        //  - Reset all fields in the user table
        //  - Delete all wall posts
        //  - Delete all comments
        //  - Delete all unread wall posts
        //  - Delete all unread comments
        //  - Delete all login tokens
        //  - Delete all poll votes 
        //  - Delete all likes
        //  - Delete all events created by the user
    })

    await transaction()
    db.close()
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

if(isMainModule(import.meta.url)) {
    main()
    parentPort?.postMessage("done")
}

export {
    main as job
}

