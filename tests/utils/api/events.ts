import { APIRequestContext } from "@playwright/test"
import { ParticipationStatus } from "common/enums"
import { Participant } from "common/interfaces"

async function getAllEventParticipants(request: APIRequestContext, eventId: number) {
    const res = await request.get(`/api/events/${eventId}/participants`)
    if(!res.ok()) {
        throw new Error(`Failed to get all event participants.\n${res.status()}: ${res.statusText()}`)
    }
    const participants = await res.json() as Participant[]
    return participants   
}

async function upsertEventParticipant(request: APIRequestContext, eventId: number, status: ParticipationStatus) {
    const res = await request.put(`/api/events/${eventId}/participants/me`, { data: { status: status } })
    if(!res.ok()) {
        throw new Error(`Failed to upsert event participant.\n${res.status()}: ${res.statusText()}`)
    }
}

export const eventsApi = {
    participants: {
        getAll: getAllEventParticipants,
        upsert: upsertEventParticipant
    }
}