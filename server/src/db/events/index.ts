import { deleteEvent } from "./delete.js"
import { getAllEvents, getEvent } from "./get.js"
import { participantsDb } from "./participants/index.js"
import { upsertEvent } from "./upsert.js"

export const eventsDb = {
    get: getEvent,
    getAll: getAllEvents,
    upsert: upsertEvent,
    delete: deleteEvent,
    
    participants: {
        ...participantsDb
    }
}