import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../../config/databaseConfig.js"
import { pollOptionsDb } from "../options/index.js"

export function upsertVotes(userId: number, poll_id: number, optionIds: number[]) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const allOptionIds = pollOptionsDb.getAllIds(poll_id)
    const questionMarks = allOptionIds.map(() => "?")
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

    db.transaction(() => {
        deleteStmt.run(userId, allOptionIds)
        optionIds.forEach(optionId => {
            insertStmt.run(optionId, userId)
        })
    })()

    db.close()
}
