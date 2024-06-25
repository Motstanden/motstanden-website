import Database from "better-sqlite3"
import { ParticipationStatus } from "common/enums"
import { dbReadWriteConfig, motstandenDB } from "../../../config/databaseConfig.js"
import { getStatusId } from "./get.js"


export function upsert(eventId: number, userId: number, newStatus: ParticipationStatus) {
    const statusId = getStatusId(newStatus)
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const stmt = db.prepare(`
        INSERT INTO 
            event_participant(event_id, user_id, participation_status_id) 
        VALUES 
            (@eventId, @userId, @statusId) 
        ON CONFLICT(event_id, user_id) 
        DO UPDATE SET 
            participation_status_id = excluded.participation_status_id 
        WHERE 
            event_id = excluded.event_id AND user_id = excluded.user_id;`
    )
    stmt.run({
        eventId: eventId,
        userId: userId,
        statusId: statusId
    })

    db.close()
}
