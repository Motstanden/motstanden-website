import { deleteEvent } from "./delete.js"
import { getAllEvents, getEvent } from "./get.js"
import { insertEvent } from "./insert.js"
import { participantsDb } from "./participants/index.js"

export const eventsDb = {
    get: getEvent,
    getAll: getAllEvents,
    insert: insertEvent,
    delete: deleteEvent,
    
    participants: {
        ...participantsDb
    }
}