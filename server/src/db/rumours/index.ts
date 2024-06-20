import { deleteRumour } from "./delete.js"
import { get, getAll } from "./get.js"
import { insertRumour } from "./insert.js"
import { update } from "./update.js"

export const rumoursDb = {
    get: get,
    getAll: getAll,
    insert: insertRumour,
    delete: deleteRumour,
    update: update
}