import Database from "better-sqlite3";
import { NewEventData, EventData } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";
import domPurify from "../lib/DOMPurify";
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils";

export function getEvents( { 
    upcoming, 
    limit
} : { 
    upcoming: boolean, 
    limit?: number 
} ): EventData[] {
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

    let events = stmt.all(args)
    db.close()

    const parsedEvents: EventData[] = events.map(item => {
        try {
            return {
                ...item,
                keyInfo: JSON.parse(item.keyInfo)
            }
        } catch { 
            // This should never happen. 
            // But if there somehow is an error in the database we will simply filter the error out
            return null 
        }
    }).filter(item => !!item);
    
    return parsedEvents
}

function createValidEvent(event: NewEventData): NewEventData | undefined {

    let isValidExtraInfo = false
    if(Array.isArray(event.keyInfo)) {
        if ( event.keyInfo.length === 0) {
            isValidExtraInfo = true
        }
        else {
            event.keyInfo.forEach( item => {
                isValidExtraInfo = Object.keys(item).length === 2 && "key" in item && "value" in item
            })
        }
    }

    if (
        stringIsNullOrWhiteSpace(event.title)                                       ||
        stringIsNullOrWhiteSpace(event.startDateTime)                               ||
        (stringIsNullOrWhiteSpace(event.endDateTime) && event.endDateTime !== null) ||
        !isValidExtraInfo                                                           ||
        stringIsNullOrWhiteSpace(event.description)
    ) {
        console.log("-------------------------------------------")
        return undefined
    }

    // THIS STEP IS SUPER IMPORTANT!!! It prevents xss attacks
    const sanitizedHtml = domPurify.sanitize(event.description, { USE_PROFILES: { html: true } })

    if(stringIsNullOrWhiteSpace(sanitizedHtml))
        return undefined

    const newEvent: NewEventData = {
        title: event.title.trim(),
        startDateTime: event.startDateTime.trim(),
        endDateTime: event.endDateTime?.trim() ?? null,
        keyInfo: event.keyInfo,
        description: sanitizedHtml.trim()
    }
    return newEvent
}

export function newEvent( unsafeEvent: NewEventData, createdByUserId: number): number | bigint {
    const validEvent = createValidEvent(unsafeEvent)
    if(!validEvent)
        throw "Bad data"

    const db = new Database(motstandenDB, dbReadWriteConfig)
    let result: Database.RunResult | undefined
    const startTransaction = db.transaction( () => {
        const stmt = db.prepare(
            `INSERT INTO 
                event(title, start_date_time, end_date_time, key_info, description, created_by, updated_by)
            VALUES
                (?, ?, ?, ?, ?, ?, ?);`
        )
        result = stmt.run([
            validEvent.title,
            validEvent.startDateTime,
            validEvent.endDateTime,
            JSON.stringify(validEvent.keyInfo),
            validEvent.description,
            createdByUserId,
            createdByUserId,
        ])
    })

    startTransaction()
    db.close()

    if(result)
        return result.lastInsertRowid
    else 
        throw "something wen wrong"
}