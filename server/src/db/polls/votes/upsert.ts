import Database from "better-sqlite3"
import { dbReadWriteConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function upsertVotes(userId: number, pollId: number, optionIds: number[]) {
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const deleteStmt = db.prepare(`
        DELETE FROM 
            poll_vote 
        WHERE 
            user_id = @userId 
            AND poll_option_id IN (
                SELECT 
                    poll_option_id 
                FROM 
                    poll_option 
                WHERE 
                    poll_id = @pollId
            );
    `)

    const insertStmt = db.prepare(`
        INSERT INTO 
            poll_vote (poll_option_id, user_id)
        VALUES 
            (@pollOptionId, @userId)
    `)

    const transaction = db.transaction(() => {
        deleteStmt.run({
            userId: userId,
            pollId: pollId
        })
        optionIds.forEach(optionId => {
            insertStmt.run({
                pollOptionId: optionId,
                userId: userId
            })
        })
    })

    transaction()

    db.close()
}
