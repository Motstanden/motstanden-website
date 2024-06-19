import Database from "better-sqlite3"
import { PollOptionVoters } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../../config/databaseConfig.js"

interface DbPollOptionVoters extends Omit<PollOptionVoters, "voters"> {
    voters: string
}

export function getPollVoters(pollId: number): PollOptionVoters[] {
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

    const dbData = <DbPollOptionVoters[] | undefined>stmt.all(pollId)
    db.close()

    if (!dbData)
        throw `Something went wrong when querying vw_poll_voter for poll_id: ${pollId}`    

    const voterData: PollOptionVoters[] = dbData.map(item => ({
        ...item,
        voters: JSON.parse(item.voters)
    }))    

    return voterData
}    
