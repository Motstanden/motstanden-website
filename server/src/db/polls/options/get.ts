import Database from "better-sqlite3"
import { PollOption } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../../config/databaseConfig.js"

interface DbPollOption extends Omit<PollOption, "isVotedOnByUser"> {
    isVotedOnByUser: number
}

export function getPollOptions(userId: number, pollId: number): PollOption[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)

    const stmt = db.prepare(`
        SELECT 
            poll_option_id as id, 
            text, 
            votes as voteCount,
            poll_option_id IN (
                SELECT 
                    poll_option_id 
                FROM 
                    poll_vote 
                WHERE user_id = ?
            ) as isVotedOnByUser
        FROM 
            vw_poll_option 
        WHERE poll_id = ?
    `)

    const dbOptions = <DbPollOption[]>stmt.all(userId, pollId)
    db.close()

    const options = dbOptions.map(item => ({
        ...item,
        isVotedOnByUser: item.isVotedOnByUser === 1
    }))

    return options
}

export function getPollOptionIds(pollId: number): number[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            poll_option_id as id
        FROM 
            poll_option 
        WHERE 
            poll_id = ?
    `)

    const dbData = <{ id: number}[]> stmt.all(pollId)
    db.close()

    const ids = dbData.map(item => item.id)

    return ids
}

export function allOptionIdsMatchesPollId(pollId: number, optionIds: number[]) {
    const validIds = getPollOptionIds(pollId)
    return optionIds.every(id => validIds.includes(id))
}