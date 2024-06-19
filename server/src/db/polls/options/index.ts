import { allOptionIdsMatchesPollId, getPollOptionIds, getPollOptions } from "./get.js"

export const pollOptionDb = {
    getAll: getPollOptions,
    getAllIds: getPollOptionIds,
    allIdsMatchesPollId: allOptionIdsMatchesPollId
}