import { NewEventData } from "common/interfaces"
import { dbReadWriteConfig, motstandenDB } from "../../config/databaseConfig.js"
import Database from "better-sqlite3"


export function insertEvent(event: NewEventData, userId: number): number | bigint { 

    const db = new Database(motstandenDB, dbReadWriteConfig)
    const stmt = db.prepare(`
        INSERT INTO event (
            title,
            start_date_time,
            end_date_time,
            key_info,
            description,
            created_by,
            updated_by ) 
        VALUES (
            @title,
            @startDateTime,
            @endDateTime,
            @keyInfo,
            @description,
            @createdBy,
            @updatedBy    
        )`)   
    const result = stmt.run({
        title: event.title,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        keyInfo: JSON.stringify(event.keyInfo),
        description: event.description,
        createdBy: userId,
        updatedBy: userId
    })
    db.close()

    if(result.changes <= 0)
        throw "Failed to insert event"

    return result.lastInsertRowid
}