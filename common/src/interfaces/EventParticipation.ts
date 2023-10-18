import { ParticipationStatus } from "../enums/index.js";
import { User } from "./index.js";

export interface Participant extends Pick<
    User,
    "userId" |
    "firstName" |
    "middleName" |
    "lastName" |
    "profilePicture"
> {
    status: ParticipationStatus
}

export interface UpsertParticipant {
    eventId: number,
    participationStatus: ParticipationStatus
}