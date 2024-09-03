import { APIRequestContext } from "@playwright/test"
import { Poll, PollOption, PollOptionVoters } from "common/interfaces"

async function getAllPolls(request: APIRequestContext) { 
    const res = await request.get("/api/polls")
    if(!res.ok()) {
        throw new Error(`Failed to get all polls.\n${res.status()}: ${res.statusText()}`)
    }
    const data = await res.json() as Poll[]
    return data
}

async function getPollOptions(request: APIRequestContext, pollId: number) {
    const res = await request.get(`/api/polls/${pollId}/options`)
    if(!res.ok()) {
        throw new Error(`Failed to get poll options.\n${res.status()}: ${res.statusText()}`)
    }
    const data = await res.json() as PollOption[]
    return data
}

async function getPollVoters(request: APIRequestContext, pollId: number) {
    const res = await request.get(`/api/polls/${pollId}/votes`)
    if(!res.ok()) {
        throw new Error(`Failed to get all poll voters.\n${res.status()}: ${res.statusText()}`)
    }
    const data = await res.json() as PollOptionVoters[]
    return data
}

async function upsertVote(request: APIRequestContext, pollId: number, optionIds: number[]) {
    const res = await request.put(`/api/polls/${pollId}/votes/me`, { data: optionIds })
    if(!res.ok()) {
        throw new Error(`Failed to upsert vote.\n${res.status()}: ${res.statusText()}`)
    }
}

export const pollsApi = {
    getAll: getAllPolls,
    options: {
        getAll: getPollOptions
    },
    votes: {
        upsert: upsertVote,
        getAll: getPollVoters
    },
}