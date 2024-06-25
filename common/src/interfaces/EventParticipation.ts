import { ParticipationStatus } from "../enums/index.js"
import { UserReference } from "./index.js"

export interface Participant extends UserReference {
    status: ParticipationStatus
}

export interface UpsertParticipant {
    status: ParticipationStatus
}