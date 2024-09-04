import { deleteAllEventsByAuthor, deleteEvent } from "./delete.js"
import { getAllEvents, getEvent } from "./get.js"
import { insertEvent } from "./insert.js"
import { participantsDb } from "./participants/index.js"
import { updateEvent } from "./update.js"

export const eventsDb = {
    get: getEvent,
    getAll: getAllEvents,
    insert: insertEvent,
    update: updateEvent,
    delete: deleteEvent,
    deleteAllByAuthor: deleteAllEventsByAuthor,
    
    participants: {
        ...participantsDb
    }
}