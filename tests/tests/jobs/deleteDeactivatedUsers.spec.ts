import { APIRequestContext, expect, test } from "@playwright/test"
import { UserGroup } from "common/enums"
import { DeactivatedUser, User } from "common/interfaces"
import { job } from "../../../server/src/jobs/deleteDeactivatedUsers.js"
import { api } from "../../utils/api/index.js"
import { apiLogIn } from "../../utils/auth.js"
import { loadServerEnv } from "../../utils/loadServerEnv.js"

test("Job deletes all identifiable user data", async ({ request }, workerInfo) => {
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
    
    const user = await api.users.createRandom(workerInfo)

    await api.users.delete(workerInfo, user.id)

    loadServerEnv()
    await job()

    // User is deleted if it is not found in the list of all active users nor the list of all deactivated users
    expect(await isActivated(request, user.id)).toBe(false)
    expect(await isDeactivated(request, user.id)).toBe(false)
})

async function isDeactivated(request: APIRequestContext, userId: number): Promise<boolean> {
    const res = await request.get("/api/users/deactivated")
    const allDeactivatedUsers: DeactivatedUser[] = await res.json()
    const user = allDeactivatedUsers.find(u => u.id === userId)
    return user !== undefined
}

async function isActivated(request: APIRequestContext, userId: number) {
    const res = await request.get("/api/users")
    if(res.status() === 404)
        return false

    const allUsers: User[] = await res.json()
    const user = allUsers.find(u => u.id === userId)
    return user !== undefined
}