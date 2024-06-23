import Database from "better-sqlite3"
import { NewPollWithOption } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function insertNewPoll(newPoll: NewPollWithOption, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const pollSmt = db.prepare(`
        INSERT INTO
            poll(title, type, created_by, updated_by)
        VALUES (@title, @type, @createdBy, @updatedBy)
    `)

    const optionStmt = db.prepare(` 
        INSERT INTO
            poll_option(text, poll_id)
        VALUES (@text, @pollId)
    `)

    db.transaction(() => {
        const pollResult = pollSmt.run({
            title: newPoll.title,
            type: newPoll.type,
            createdBy: userId,
            updatedBy: userId
        })
        const pollId = pollResult.lastInsertRowid

        newPoll.options.forEach(option => {
            optionStmt.run({
                text: option.text,
                pollId: pollId
            })
        })
    })()
    db.close()
}
