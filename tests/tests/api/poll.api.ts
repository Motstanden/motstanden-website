import { APIRequestContext, expect, test } from '@playwright/test'
import { apiLogIn } from '../../utils/auth.js'

test.describe("GET /api/polls/:id/options", () => {

    const get = async (request: APIRequestContext, id: number) => await request.get(`/api/polls/${id}/options`)

    test("Id out of range, returns 404", async ({request}, workerInfo) => {
        await apiLogIn(request, workerInfo)
        
        const unusedIndex = 99999999999     // Unlikely to be used as an id
        const res = await get(request, unusedIndex)
        
        expect(res.status()).toBe(404)
    })
})