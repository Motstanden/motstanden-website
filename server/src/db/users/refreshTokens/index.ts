import { deleteAllByUser, deleteToken } from "./delete.js"
import { tokenExists } from "./get.js"
import { insert } from "./insert.js"

export const refreshTokensDb = {
    insert: insert,
    exists: tokenExists,
    delete: deleteToken,
    deleteAllByUser: deleteAllByUser
}