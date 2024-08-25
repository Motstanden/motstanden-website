import { expect, test } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { DeletedUser, User } from 'common/interfaces'
import { api } from '../../../utils/api/index.js'
import { apiLogIn, unsafeApiLogIn } from '../../../utils/auth.js'

test.describe("DELETE /api/users/:id", () => {

    let user: User

    test.beforeAll(async ({ }, workerInfo) => {
        user = await api.users.createRandom(workerInfo)
        await api.users.delete(workerInfo, user.id)
    })

    test.beforeEach(async ({ request }, workerInfo) => {
        await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
    })

    test("GET /api/users/:id", async ({ request }) => {
        const res = await request.get(`/api/users/${user.id}`)
        expect(res.status(), `Expected 404, but got ${res.status()}: ${res.statusText()}`).toBe(404)
    })

    test("GET api/users", async ({ request }) => {
        const allUsers = await api.users.getAll(request)
        const deletedUser = allUsers.find(u => u.id === user.id)
        expect(deletedUser).toBeUndefined()
    })

    test("GET api/users/identifiers", async ({ request }) => {
        const allUsers = await api.users.getAllIdentifiers(request)
        const deleteUser = allUsers.find(u => u.id === user.id)
        expect(deleteUser).toBeUndefined()
    })

    test("GET api/users/deleted", async ({ request }) => {
        const res = await request.get("/api/users/deleted")
        expect(res.status(), `Expected 200, but got ${res.status()}: ${res.statusText()}`).toBe(200)

        const allDeletedUsers: DeletedUser[] = await res.json()
        const deletedUser = allDeletedUsers.find(u => u.id === user.id)
        expect(deletedUser).toBeDefined()
    })

    test("PATCH /users/:id", async () => {
        throw new Error("Not implemented")
    })

    test("PUT /users/:id/personal-info", async () => {
        throw new Error("Not implemented")
    })

    test("PUT /users/:id/membership", async () => {
        throw new Error("Not implemented")
    })

    test("PUT /users/:id/role", async () => {
        throw new Error("Not implemented")
    })
})

test("DELETE /api/users/me", async ({ request }, workerInfo) => {

    // Create a new user, and log in as that user
    const user = await api.users.createRandom(workerInfo)
    await unsafeApiLogIn(request, user.email)

    // Delete current user
    await api.users.deleteCurrentUser(request)

    // Check that current user is logged out
    const res = await request.get("/api/users/me")
    expect(res.status(), `Expected 401, but got ${res.status()}: ${res.statusText()}`).toBe(401)

    // Log in as another user and validate that the user is deleted
    await apiLogIn(request, workerInfo, UserGroup.Contributor)
    const res2 = await request.get(`/api/users/${user.id}`)
    expect(res2.status(), `Expected 404, but got ${res2.status()}: ${res2.statusText()}`).toBe(404)
})
