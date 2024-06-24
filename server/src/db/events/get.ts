import Database from "better-sqlite3"
import { EventData, KeyValuePair } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../config/databaseConfig.js"

interface DbEventData extends Omit<EventData, "keyInfo"> {
    keyInfo: string
}

export function getEvent(eventId: number): EventData | undefined {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            event_id as id, 
            title, 
            start_date_time as startDateTime,
            end_date_time as endDateTime,
            key_info as keyInfo,
            description,

            created_by_user_id as createdBy,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedBy,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt,

            is_upcoming as isUpcoming
        FROM
            vw_event
        WHERE event_id = ?
    `)
    const dbResult = <DbEventData | undefined>stmt.get(eventId)
    db.close()

    return dbResult ? { 
        ...dbResult,
        keyInfo: JSON.parse(dbResult.keyInfo)
    } : undefined
}

export function getAllEvents({
    upcoming, 
    limit
}: {
    upcoming: boolean
    limit?: number
}): EventData[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            event_id as id,

            title, 
            start_date_time as startDateTime,
            end_date_time as endDateTime,
            key_info as keyInfo,
            description,

            created_by_user_id as createdBy,
            created_by_full_name as createdByName,
            created_at as createdAt,

            updated_by_user_id as updatedBy,
            updated_by_full_name as updatedByName,
            updated_at as updatedAt,

            is_upcoming as isUpcoming
        FROM 
            vw_event 
        WHERE 
            is_upcoming = ?
        ORDER BY 
            start_date_time ${upcoming ? "ASC" : "DESC"}
        ${!!limit ? "LIMIT ?" : ""}
    `)

    let args: any[] = [upcoming ? 1 : 0]
    if (!!limit)
        args.push(limit)

    let events = <DbEventData[]>stmt.all(args)
    db.close()

    const parsedEvents: EventData[] = events.map(item => {
        let keyInfo: KeyValuePair<string, string>[] = []
        try {
            keyInfo = JSON.parse(item.keyInfo)
        } catch (err) {
            console.error(`Failed to parse keyinfo for eventId ${item.id}\nError: ${err}\nData: ${item}`)
        }
        return {
            ...item,
            keyInfo
        }
    })

    return parsedEvents
}
