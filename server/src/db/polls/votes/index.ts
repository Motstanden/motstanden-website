import { deleteAllVotesByUser } from "./delete.js"
import { getPollVoters } from "./get.js"
import { upsertVotes } from "./upsert.js"

export const pollVotesDb = {
    get: getPollVoters,
    upsert: upsertVotes,
    deleteAllBy: deleteAllVotesByUser
}