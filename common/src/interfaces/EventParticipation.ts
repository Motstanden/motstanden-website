import { ParticipationStatus } from "../enums/index.js"
import { UserIdentity } from "./index.js"

export interface Participant extends UserIdentity {
    status: ParticipationStatus
}

export interface UpsertParticipant {
    status: ParticipationStatus
}