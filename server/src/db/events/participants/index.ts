import { deleteAllParticipationByUser } from "./delete.js"
import { getAll, getStatusId } from "./get.js"
import { upsert } from "./upsert.js"

export const participantsDb = {
    getAll: getAll,
    getStatusId: getStatusId,
    upsert: upsert,
    deleteAllByUser: deleteAllParticipationByUser,
}