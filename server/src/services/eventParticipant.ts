import Database from "better-sqlite3";
import { ParticipationStatus } from "common/enums";
import { ParticipationList } from "common/interfaces";
import { dbReadOnlyConfig, dbReadWriteConfig, motstandenDB } from "../config/databaseConfig.js"


export function getAll(eventId: number): ParticipationList {
    const db = new Database(motstandenDB, dbReadOnlyConfig);
    const stmt = db.prepare(`
        SELECT 
            event_id as eventId,
            participants
        FROM
            vw_event_participant
        WHERE event_id = ?
    `);
    const dbResult: { eventId: number, participants: string } = stmt.get(eventId);
    db.close()
    if (!dbResult) {
        return { eventId: eventId, participants: [] }
    }

    return { ...dbResult, participants: JSON.parse(dbResult.participants) };
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