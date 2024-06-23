import { allOptionIdsMatchesPollId, getPollOptions } from "./get.js"

export const pollOptionsDb = {
    getAll: getPollOptions,
    allIdsMatchesPollId: allOptionIdsMatchesPollId
}