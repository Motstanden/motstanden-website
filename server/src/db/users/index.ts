import { softDeleteUser, undoSoftDeleteUser } from "./delete.js"
import {
    getAllDeletedUsers,
    getAllUserIds,
    getAllUsers,
    getAllUsersAsIdentifiers,
    getDeletedUser,
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
    getByMail: getUserByMail,
    getAll: getAllUsers,
    getAllIds: getAllUserIds,
    getDeleted: getDeletedUser,
    getAllDeleted: getAllDeletedUsers,
    getAllAsIdentifiers: getAllUsersAsIdentifiers,
    exists: userExists,

    insert: insertUser,
    update: updateUser,
    softDelete: softDeleteUser,
    undoSoftDelete: undoSoftDeleteUser,

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