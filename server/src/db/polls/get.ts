import Database from "better-sqlite3"
import { Poll, PollWithOption } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"
import { pollOptionsDb } from "./options/index.js"

export function getPoll(pollId: number): Poll | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            poll_id as id, 
            title, 
            type,

            created_by_user_id as createdBy,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedBy,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt
        FROM 
            vw_poll 
        WHERE poll_id = ?
    `)

    const poll = <Poll | undefined>stmt.get(pollId)
    db.close()

    return poll
}

export function pollExists(pollId: number): boolean {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            poll_id as id
        FROM poll 
            WHERE poll_id = ?`
    )
    const result = stmt.get(pollId)
    db.close()
    return result !== undefined

}

export function getPollWithOptions(userId: number, pollId: number): PollWithOption | undefined {
    const poll = getPoll(pollId)
    if (!poll) {
        return undefined
    }
    const options = pollOptionsDb.getAll(userId, pollId)
    const result: PollWithOption = {
        ...poll,
        options: options
    }
    return result
}

export function getNewest(): Poll | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            MAX(poll_id) as id, 
            title, 
            type,

            created_by_user_id as createdBy,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedBy,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt
        FROM 
            vw_poll
    `)

    const poll = <Poll | undefined>stmt.get()
    db.close()

    return poll
}

export function getAllPolls(): Poll[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            poll_id as id, 
            title, 
            type,

            created_by_user_id as createdBy,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedBy,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt            
        FROM 
            vw_poll 
        ORDER BY poll_id DESC
    `)

    const pollList = <Poll[]>stmt.all()
    db.close()

    return pollList
}
