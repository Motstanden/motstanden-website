import Database from "better-sqlite3"
import { NewEventData } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"

export function updateEvent(event: NewEventData, eventId: number, userId: number) {
    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        UPDATE 
            event
        SET
            title = @title,
            start_date_time = @startDateTime,
            end_date_time = @endDateTime,
            key_info = @keyInfo,
            description = @description,
            updated_by = @updatedBy
        WHERE 
            event_id = @eventId`
    )
    stmt.run({
        title: event.title,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        keyInfo: JSON.stringify(event.keyInfo),
        description: event.description,
        updatedBy: userId,
        eventId: eventId
    })
    db.close()
}