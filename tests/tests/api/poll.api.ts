import { APIRequestContext, expect, test } from '@playwright/test'
import { Poll } from 'common/interfaces'
import { z } from 'zod'
import { apiLogIn } from '../../utils/auth.js'
import { dateTimeSchema } from '../../utils/zodtypes.js'

test.describe("GET /api/polls/:id/options", () => {

    test("Id out of range, returns 404", async ({ request }, workerInfo) => {
        await apiLogIn(request, workerInfo)

        const unusedIndex = 99999999999     // Unlikely to be used as an id
        const res = await get.pollOptions(request, unusedIndex)

        expect(res.status()).toBe(404)
    })
})

test.describe("GET /api/polls/latest", () => {

    test("Returns valid object", async ({ request }, workerInfo) => {
        await apiLogIn(request, workerInfo)

        const res = await get.latestPoll(request)
        expect(res.ok()).toBeTruthy()

        const poll = await res.json()
        expect(() => pollSchema.parse(poll)).not.toThrow()
    })

})

test.describe("GET /polls/all", () => {

    test("Returns valid object", async ({ request }, workerInfo) => {
        await apiLogIn(request, workerInfo)

        const res = await request.get("/api/polls/all")
        expect(res.ok()).toBeTruthy()

        const polls = await res.json()
        expect(() => pollArraySchema.parse(polls)).not.toThrow()
    })
})

test.describe("GET /polls/:id/options", () => {

    const getLatestPoll = async (request: APIRequestContext) => { 
        const res = await get.latestPoll(request)
        return await res.json() as Poll
    }

    test("Returns valid object", async ({ request }, workerInfo) => {
        await apiLogIn(request, workerInfo)

        const poll = await getLatestPoll(request)

        const res = await request.get(`/api/polls/${poll.id}/options`)
        expect(res.ok()).toBeTruthy()

        const options = await res.json()
        expect(() => z.array(pollOptionSchema).parse(options)).not.toThrow()
    })
})

const get = {
    pollOptions: async (request: APIRequestContext, id: number) => await request.get(`/api/polls/${id}/options`),
    latestPoll: async (request: APIRequestContext) => await request.get("/api/polls/latest"),
}

const newPollSchema = z.object({
    title: z.string(),
    type: z.union([z.literal('single'), z.literal('multiple')]),
});

const pollSchema = newPollSchema.extend({
    id: z.number(),
    createdBy: z.number(),
    createdByName: z.string(),
    createdAt: dateTimeSchema,
    updatedBy: z.number(),
    updatedByName: z.string(),
    updatedAt: dateTimeSchema,
});

const pollArraySchema = z.array(pollSchema);

const newPollOptionSchema = z.object({
    text: z.string(),
});

const pollOptionSchema = newPollOptionSchema.extend({
    id: z.number(),
    voteCount: z.number(),
    isVotedOnByUser: z.boolean(),
});

const pollOptionArraySchema = z.array(pollOptionSchema);