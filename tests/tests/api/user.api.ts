import { expect, test } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { apiLogIn, getUser } from '../../utils/auth.js'


test.describe("GET requests sends correct types", () => {

    test.beforeEach( async ({request}, workerInfo) => {
        const user = getUser(workerInfo, UserGroup.Contributor)
        await apiLogIn(request, user)
    })

    test("GET /member-list", async ({request}) => {
        const res = await request.get("/api/member-list")
        expect(res.ok()).toBeTruthy()
    })

    test("GET /simplified-member-list", async ({request}) => {
        const res = await request.get("/api/simplified-member-list")
        expect(res.ok()).toBeTruthy()
    })
})