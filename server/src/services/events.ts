import Database from "better-sqlite3";
import { isValidRichText } from "common/richTextSchema";
import { NewEventData, EventData, UpsertEventData } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig";
import domPurify from "../lib/DOMPurify";
import { DbWriteAction } from "../ts/enums/DbWriteAction";
import { UpsertDb } from "../ts/types/UpsertDb";
import { stringIsNullOrWhiteSpace } from "../utils/stringUtils";

const allEventColumns = `
    event_id as eventId, 
    title, 
    start_date_time as startDateTime,
    end_date_time as endDateTime,
    key_info as keyInfo,
    description_json as description,

    created_by_user_id as createdByUserId,
    created_by_full_name as createdByName,
    created_at as createdAt,

    updated_by_user_id as updatedByUserId,
    updated_by_full_name as updatedByName,
    updated_at as updatedAt,

    is_upcoming as isUpcoming
`

export function getEvent(eventId: number): EventData {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            ${allEventColumns}
        FROM
            vw_event
        WHERE event_id = ?
    `)
    const dbResult = stmt.get(eventId)
    db.close()
    
    if(!dbResult)
        throw "Bad data"
    
    const event: EventData = {...dbResult, keyInfo: JSON.parse(dbResult.keyInfo), description: JSON.parse(dbResult.description)}
    
    return event
}

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
        ${allEventColumns}
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
                keyInfo: JSON.parse(item.keyInfo),
                description: JSON.parse(item.description)
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
            for(let i = 0; i < event.keyInfo.length; i++) {
                const item = event.keyInfo[i]
                const hasCorrectProps = Object.keys(item).length === 2 && "key" in item && "value" in item
                const isCorrectLength = item.key.length <= 16 && item.value.length <= 100
                isValidExtraInfo = hasCorrectProps && isCorrectLength
                if(!isValidExtraInfo) {
                    break
                }
            }
        }
    }

    if (
        stringIsNullOrWhiteSpace(event.title)                                       ||
        stringIsNullOrWhiteSpace(event.startDateTime)                               ||
        (stringIsNullOrWhiteSpace(event.endDateTime) && event.endDateTime !== null) ||
        !isValidExtraInfo                                                           ||
        stringIsNullOrWhiteSpace(event.descriptionHtml)                             ||
        !isValidRichText(event.description)
    ) {
        return undefined
    }

    // THIS STEP IS SUPER IMPORTANT!!! It prevents xss attacks
    const sanitizedHtml = domPurify.sanitize(event.descriptionHtml, { USE_PROFILES: { html: true } })

    if(stringIsNullOrWhiteSpace(sanitizedHtml))
        return undefined

    const newEvent: NewEventData = {
        title: event.title.trim(),
        startDateTime: event.startDateTime.trim(),
        endDateTime: event.endDateTime?.trim() ?? null,
        keyInfo: event.keyInfo,
        description: event.description,
        descriptionHtml: sanitizedHtml.trim()
    }
    return newEvent
}

export function upsertEvent( unsafeEvent: UpsertEventData, modifiedBy: number, action: UpsertDb): number | bigint {
    const validEvent = createValidEvent(unsafeEvent)
    if(!validEvent)
        throw "Bad data"  

    const sql = buildUpsertSql({...validEvent, eventId: unsafeEvent.eventId}, modifiedBy, action)
    const db = new Database(motstandenDB, dbReadWriteConfig)
    let result: Database.RunResult | undefined
    const startTransaction = db.transaction( () => {
        const stmt = db.prepare(sql.stmt)
        result = stmt.run(sql.args)
    })

    startTransaction()
    db.close()

    if(result && result.changes > 0)
        return result.lastInsertRowid
    else 
        throw "something went wrong"
}

function buildUpsertSql( 
    validEvent: UpsertEventData, 
    modifiedBy: number, 
    action: UpsertDb 
) : { 
    stmt: string, 
    args: any[] 
}  { 

    const commonArgs = [
        validEvent.title,
        validEvent.startDateTime,
        validEvent.endDateTime,
        JSON.stringify(validEvent.keyInfo),
        JSON.stringify(validEvent.description),
        validEvent.descriptionHtml,
        modifiedBy,
    ]

    if(action === DbWriteAction.Update) {
        if(!validEvent.eventId)
            throw `Requires eventId`

        return {
            stmt: 
                `UPDATE event
                SET
                    title = ?,
                    start_date_time = ?,
                    end_date_time = ?,
                    key_info = ?,
                    description_json = ?,
                    description_html = ?,
                    updated_by = ?
                WHERE 
                    event_id = ?;
                `,
            args: [...commonArgs, validEvent.eventId]
        }
    }

    return {
        stmt: 
            `INSERT INTO 
                event(title, start_date_time, end_date_time, key_info, description_json, description_html, created_by, updated_by)
            VALUES
                (?, ?, ?, ?, ?, ?, ?);`,
        args: [ ...commonArgs, modifiedBy ]
    }
}

export function deleteEvent(eventId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const startTransaction = db.transaction( () => {
        const stmt = db.prepare(`
            DELETE FROM 
                event
            WHERE event_id = ?;`
        )
        stmt.run(eventId)
    })
    startTransaction()
    db.close()
}