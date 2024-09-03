import { activateUser, deactivateUser } from "./deactivate.js"
import {
    getAllDeactivatedUsers,
    getAllUserIds,
    getAllUsers,
    getAllUsersAsIdentifiers,
    getDeactivatedUser,
    getUser,
    getUserByMail,
    userExists
} from "./get.js"
import { userGroupsDb } from "./groups/index.js"
import { insertUser } from "./insert.js"
import { userRanksDb } from "./ranks/index.js"
import { refreshTokensDb } from "./refreshTokens/index.js"
import { userStatusDb } from "./status/index.js"
import { updateUser } from "./update.js"

export const usersDb = {
    get: getUser,
    getDeactivated: getDeactivatedUser,
    
    getAll: getAllUsers,
    getAllDeactivated: getAllDeactivatedUsers,
    
    getByMail: getUserByMail,
    getAllIds: getAllUserIds,
    getAllAsIdentifiers: getAllUsersAsIdentifiers,
    exists: userExists,

    insert: insertUser,
    update: updateUser,

    deactivate: deactivateUser,
    activate: activateUser,

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