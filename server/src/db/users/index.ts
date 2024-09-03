import { activateUser, deactivateUser } from "./deactivate.js"
import { softDeleteUser, undoSoftDeleteUser } from "./delete.js"
import {
    getActivatedUser,
    getAllActivatedUsers,
    getAllDeactivatedUsers,
    getAllUserIds,
    getAllUsersAsIdentifiers,
    getDeactivatedUser,
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
    get: getActivatedUser,
    getDeactivated: getDeactivatedUser,
    
    getAll: getAllActivatedUsers,
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