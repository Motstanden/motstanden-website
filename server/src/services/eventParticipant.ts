import Database from "better-sqlite3";
import { ParticipationStatus } from "common/enums";
import { Participant } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"


export function getAll(eventId: number): Participant[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig);
    const stmt = db.prepare(`
        SELECT 
            user_id as userId,
            first_name as firstName,
            middle_name as middleName,
            last_name as lastName,
            profile_picture as profilePicture,
            status
        FROM
            vw_event_participant
        WHERE event_id = ?
    `);
    const participant: Participant[]  = stmt.all(eventId);
    db.close()

    return participant
}

export function upsert(eventId: number, userId: number, newStatus: ParticipationStatus) {
    const statusId = getStatusId(newStatus)
    const db = new Database(motstandenDB, dbReadWriteConfig)

    const startTransaction = db.transaction(() => {
        const stmt = db.prepare(`
            INSERT INTO 
                event_participant(event_id, user_id, participation_status_id) 
            VALUES 
                (?, ?, ?) 
            ON CONFLICT(event_id, user_id) 
            DO UPDATE SET 
                participation_status_id = excluded.participation_status_id 
            WHERE 
                event_id = excluded.event_id AND user_id = excluded.user_id;`
        )
        const info = stmt.run([eventId, userId, statusId])
    })

    startTransaction();
    db.close()
}

function getStatusId(status: ParticipationStatus): number {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            participation_status_id as statusId
        FROM
            participation_status
        WHERE 
            status = ?
    `)
    const result = stmt.get(status.toString())
    db.close()

    if (!result.statusId)
        throw "Could not retrieve participation status id"


    return result.statusId as number
}