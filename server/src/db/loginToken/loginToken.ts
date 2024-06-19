import { deleteAllMatches, deleteToken } from "./delete.js"
import { tokenExists } from "./get.js"
import { insert } from "./insert.js"

export const loginTokenDb = {
    insert: insert,
    exists: tokenExists,
    delete: deleteToken,
    deleteAllMatches: deleteAllMatches
}