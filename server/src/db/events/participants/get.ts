import Database from "better-sqlite3"
import { ParticipationStatus } from "common/enums"
import { Participant } from "common/interfaces"
import { dbReadOnlyConfig, motstandenDB } from "../../../config/databaseConfig.js"

export function getAll(eventId: number): Participant[] {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            user_id as id,
            status,
            full_name as fullName,
            SUBSTR(first_name, 1, 1) || SUBSTR(last_name, 1, 1) AS initials
        FROM
            vw_event_participant
        WHERE event_id = ?
    `)
    const participant = <Participant[]>stmt.all(eventId)
    db.close()

    return participant
}

export function getStatusId(status: ParticipationStatus): number {
    const db = new Database(motstandenDB, dbReadOnlyConfig)
    const stmt = db.prepare(`
        SELECT 
            participation_status_id as statusId
        FROM
            participation_status
        WHERE 
            status = ?
    `)
    const result = <{ statusId: number}  | undefined>stmt.get(status.toString())
    db.close()

    if (!result?.statusId)
        throw "Could not retrieve participation status id"

    return result.statusId
}
