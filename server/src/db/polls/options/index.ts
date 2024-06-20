import { allOptionIdsMatchesPollId, getPollOptionIds, getPollOptions } from "./get.js"

export const pollOptionsDb = {
    getAll: getPollOptions,
    getAllIds: getPollOptionIds,
    allIdsMatchesPollId: allOptionIdsMatchesPollId
}