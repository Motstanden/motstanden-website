import { APIRequestContext } from "@playwright/test"
import { ParticipationStatus } from "common/enums"
import { EventData, NewEventData, Participant } from "common/interfaces"

async function createNewEvent(request: APIRequestContext, event: NewEventData) {
    const res = await request.post("/api/events", { data: event })
    if(!res.ok()) {
        throw new Error(`Failed to create new event.\n${res.status()}: ${res.statusText()}`)
    }
    const data = await res.json() as { id: number }
    return data.id
}

async function getAllEvents(request: APIRequestContext) { 
    const res = await request.get("/api/events")
    if(!res.ok()) {
        throw new Error(`Failed to get all events.\n${res.status()}: ${res.statusText()}`)
    }
    const data = await res.json() as EventData[]
    return data
}

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
    new: createNewEvent,
    getAll: getAllEvents,
    participants: {
        getAll: getAllEventParticipants,
        upsert: upsertEventParticipant
    }
}