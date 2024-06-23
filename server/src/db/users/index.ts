import { getAllAsUserReference, getAllUserIds, getAllUsers, getUser, getUserByMail, userExists } from "./get.js"
import { userGroupsDb } from "./groups/index.js"
import { insertUser } from "./insert.js"
import { userRanksDb } from "./ranks/index.js"
import { refreshTokensDb } from "./refreshTokens/index.js"
import { userStatusDb } from "./status/index.js"
import { updateUser } from "./update.js"

export const usersDb = {
    get: getUser,
    getByMail: getUserByMail,
    getAll: getAllUsers,
    getAllIds: getAllUserIds,
    getAllAsReference: getAllAsUserReference,
    exists: userExists,

    insert: insertUser,
    update: updateUser,

    groups: {
        ...userGroupsDb
    },
    ranks: {
        ...userRanksDb
    },
    status: {
        ...userStatusDb
    },
    
    refreshTokens: {
        ...refreshTokensDb
    },
}