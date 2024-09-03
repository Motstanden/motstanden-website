import Database, { Database as DatabaseType } from "better-sqlite3"
import { parentPort } from 'node:worker_threads'
import { dbReadWriteConfig, motstandenDB } from '../config/databaseConfig.js'
import { db as DB } from '../db/index.js'
import { isMainModule } from '../utils/isMainModule.js'
import { sleepAsync } from '../utils/sleepAsync.js'

/**
 * Entry point for the job `deleteDeactivatedUsers`
 */
async function main() {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const users = DB.users.getAllDeactivated()

    // TODO: Filter out users that were deactivated less than 90 days ago

    const transaction = db.transaction(async () => { 

        for (const user of users) {
            DeleteUser(db, user.id)
        }

        // Avoid race conditions by waiting for any ongoing writes to the user table to finish
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

    parentPort?.postMessage("done")
}

function DeleteUser(db: DatabaseType, userId: number) {
    throw new Error("Not implemented")
}

if(isMainModule(import.meta.url)) {
    main()
}

export {
    main as job
}

