import { UserGroup } from "common/enums"
import { testUserVariationsCount, unsafeGetUser } from "../../utils/auth.js"
import { APIRequestContext, expect, request, test } from '@playwright/test'
import { Count } from "common/interfaces"

test.describe.serial("Comments test suite", () => {
    const user1 = unsafeGetUser(UserGroup.Contributor, testUserVariationsCount - 1)
    const user2 = unsafeGetUser(UserGroup.Administrator, testUserVariationsCount - 1)
    
    let api1: APIRequestContext
    let api2: APIRequestContext

    test.beforeEach( async () => {
        api1 = await request.newContext( { storageState: user1.storageStatePath } )
        api2 = await request.newContext( {storageState: user2.storageStatePath })
    })

    test.afterEach( async () => { 
        api1.dispose()
        api2.dispose()
    })

    test("Initial unread comments count is 0", async ({ }) => {
        await resetUnreadCount(api1)
        await resetUnreadCount(api2)

        const count1 = await getUnreadCount(api1)
        const count2 = await getUnreadCount(api2)

        expect(count1).toBe(0)
        expect(count2).toBe(0)
    })
})

async function getUnreadCount(api:APIRequestContext) {
    const res = await api.get("/api/comments/unread/count")
    if(!res.ok())
        throw new Error("Failed to get unread count")
    const data = await res.json() as Count
    return data.count
}

async function resetUnreadCount(api: APIRequestContext) { 
    const res = await api.post("/api/comments/unread/count/reset")
    if(!res.ok())
        throw new Error("Failed to reset unread count")
}