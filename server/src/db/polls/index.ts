import { deletePoll } from "./delete.js"
import { getAllPolls, getNewest, getPoll, getPollWithOptions, pollExists } from "./get.js"
import { insertNewPoll } from "./insert.js"
import { pollOptionDb } from "./options/index.js"
import { pollVotesDb } from "./votes/index.js"

export const pollsDb = {
    get: getPoll,
    getWithOptions: getPollWithOptions,
    getAll: getAllPolls,
    getNewest: getNewest,
    exists: pollExists,

    delete: deletePoll,
    insert: insertNewPoll,

    options: {
        ...pollOptionDb
    },

    votes: {
        ...pollVotesDb
    }
}