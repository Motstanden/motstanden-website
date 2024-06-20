import { getAllAsUserReference, getAllUsers, getUser, getUserByMail, userExists } from "./get.js"
import { insertUser } from "./insert.js"
import { updateUser } from "./update.js"

export const usersDb = {
    get: getUser,
    getByMail: getUserByMail,
    getAll: getAllUsers,
    getAllAsReference: getAllAsUserReference,
    exists: userExists,

    insert: insertUser,
    update: updateUser
}