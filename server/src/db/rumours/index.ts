import { deleteRumour } from "./delete.js"
import { getAll, getRumourAuthorInfo } from "./get.js"
import { insertRumour } from "./insert.js"
import { update } from "./update.js"

export const rumoursDb = {
    getAuthorInfo: getRumourAuthorInfo,
    getAll: getAll,
    insert: insertRumour,
    delete: deleteRumour,
    update: update
}