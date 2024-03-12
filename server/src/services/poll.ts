import Database from "better-sqlite3";
import { NewPollWithOption, Poll, PollOption, PollOptionVoters, PollWithOption } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js";

interface DbPollOption extends Omit<PollOption, "isVotedOnByUser"> {
    isVotedOnByUser: number,
}

function getPoll(pollId: number): Poll {
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

    const poll = <Poll | undefined> stmt.get(pollId)
    db.close()

    if(!poll)
        throw "Bad data"

    return poll
}

function isValidPollId(pollId: number): boolean { 
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

function getPollWithOptions(userId: number, pollId: number): PollWithOption {

    const poll = getPoll(pollId)
    const options = getPollOptions(userId, pollId)
    const result: PollWithOption = {
        ...poll,
        options: options
    }
    return result
}


function getPollOptions(userId: number, pollId: number): PollOption[] {
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

    const dbOptions = <DbPollOption[] | undefined> stmt.all(userId, pollId)
    db.close()

    if(!dbOptions)
        throw "Bad data"

    const options = dbOptions.map( item => ({
        ...item, 
        isVotedOnByUser: item.isVotedOnByUser === 1
    }))

    return options
}

function getNewest(): Poll {
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
    
    const poll = (<Poll | undefined> stmt.get())
    
    db.close()

    if(!poll)
        throw "Something went terribly wrong..."

    return poll
}


function getAllPolls() : Poll[] {
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

    const pollList = <Poll[] | undefined> stmt.all()
    db.close()

    if(!pollList)
        throw "Bad data"

    return pollList   
}

function getPollOptionIds(pollId: number): number[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig) 
    const stmt = db.prepare(`
        SELECT 
            poll_option_id as id
        FROM 
            poll_option 
        WHERE 
            poll_id = ?
    `)

    const dbData = <{id: number}[] | undefined> stmt.all(pollId)
    db.close()
    
    if(!dbData)
        throw "Something went terribly wrong..."

    const ids = dbData.map( item => item.id)

    return ids
 }

interface DbPollOptionVoters extends Omit<PollOptionVoters, "voters"> {
    voters: string,
}

 function getPollVoters(pollId: number): PollOptionVoters[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            poll_option_id as optionId, 
            JSON_GROUP_ARRAY(
                JSON_OBJECT(
                    'id', user_id, 
                    'fullName', full_name, 
                    'initials', SUBSTR(first_name, 1, 1) || SUBSTR(last_name, 1, 1))
                ) 
            AS voters
        FROM 
            vw_poll_voter
        WHERE
            poll_id = ?
        GROUP BY 
            poll_option_id;
    `)
    
    const dbData = <DbPollOptionVoters[] | undefined> stmt.all(pollId)
    db.close()

    if(!dbData)
        throw `Something went wrong when querying vw_poll_voter for poll_id: ${pollId}`

    const voterData: PollOptionVoters[] = dbData.map( item => ({
        ...item,
        voters: JSON.parse(item.voters)
    }))
    
    return voterData
}

function isValidCombination(pollId: number, rawIds: number[]){
    const validIds = getPollOptionIds(pollId)   
    return rawIds.every(id => validIds.includes(id))
}

function insertNewPoll(newPoll: NewPollWithOption, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const pollSmt = db.prepare(`
        INSERT INTO
            poll(title, type, created_by, updated_by)
        VALUES (?, ?, ?, ?)
    `)
    
    const optionStm = db.prepare(` 
        INSERT INTO
            poll_option(text, poll_id)
        VALUES (?, ?)
    `)

    db.transaction( () => {
        const pollResult = pollSmt.run(newPoll.title, newPoll.type, userId, userId)
        const pollId = pollResult.lastInsertRowid

        newPoll.options.forEach( option => {
            optionStm.run(option.text, pollId)
        })
    })()
    db.close()
}


function upsertVotes(userId: number, poll_id: number, optionIds: number[]) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const allOptionIds = getPollOptionIds(poll_id)
    const questionMarks = allOptionIds.map( () => "?")
    const deleteStmt = db.prepare(`
        DELETE FROM 
            poll_vote 
        WHERE 
            user_id = ? AND poll_option_id in (${questionMarks.join(",")});
    `)

    const insertStmt = db.prepare(`
        INSERT INTO 
            poll_vote (poll_option_id, user_id)
        VALUES (?, ?)
    `)

    db.transaction( () => {
        deleteStmt.run(userId, allOptionIds)
        optionIds.forEach( optionId => {
            insertStmt.run(optionId, userId)
        })
    })()

    db.close()
}

function deletePoll(pollId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            DELETE FROM 
                poll 
            WHERE 
                poll_id = ?
        `)
        stmt.run(pollId)
    })
    startTransaction()
    db.close()
}

export const pollService = {
    get: getPoll,
    getAll: getAllPolls,
    isValidId: isValidPollId,
    delete: deletePoll,
    getNewest: getNewest,
    getPollWithOptions: getPollWithOptions,
    getPollOptions: getPollOptions,
    getPollVoters: getPollVoters,
    insertNew: insertNewPoll,
}

export const pollVoteService = {
    isValidCombination: isValidCombination,
    upsertVotes: upsertVotes
}