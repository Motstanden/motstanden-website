import { ParticipationStatus } from "../enums";
import { User } from "./User";

export interface ParticipationList {
    eventId: number,
    participants: Participant[]
}

export interface Participant extends Pick<
    User,
    "userId" |
    "firstName" |
    "middleName" |
    "lastName" |
    "profilePicture"
> {
    participationStatus: ParticipationStatus
}

export interface UpsertParticipant extends
    Pick<Participant, "participationStatus">,
    Pick<ParticipationList, "eventId"> {
}