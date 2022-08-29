import Database from "better-sqlite3";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";

export function getEvents( { 
    upcoming, 
    limit
} : { 
    upcoming: boolean, 
    limit?: number 
} ): Event[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
    SELECT 
        event_id as eventId, 
        title, 
        start_date_time as startDateTime,
        end_date_time as endDateTime,
        key_info as keyInfo,
        description,

        created_by_user_id as createdByUserId,
        created_by_full_name as createdByName,
        created_at,

        updated_by_user_id as updatedByUserId,
        updated_by_full_name as updatedByName,
        updated_at,

        is_upcoming as isUpcoming
    FROM 
        vw_event 
    WHERE is_upcoming = ?
    ORDER BY start_date_time ${ upcoming ? "ASC" : "DESC" }
    ${!!limit ? "LIMIT ?" : ""}`)

    let args: any[]  = [ upcoming ? 1 : 0 ]
    if(!!limit)
        args.push(limit)

    const events = stmt.all(args)
    db.close()
    return events as Event[]
}
