import { expect, test } from '@playwright/test'
import { UserGroup, UserStatus } from 'common/enums'
import { DeletedUser, UpdateUserRoleBody, User } from 'common/interfaces'
import { api } from '../../../utils/api/index.js'
import { apiLogIn, unsafeApiLogIn } from '../../../utils/auth.js'
import { assertEqualUsers, getRandomPayloadFor } from './utils.js'

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

    test("PATCH /users/:id", async ({request}) => {
        const payload = getRandomPayloadFor("users/:id")
        const res = await request.patch(`/api/users/${user.id}`, { data: payload })
        expect(res.status(), `Expected 404, but got ${res.status()}: ${res.statusText()}`).toBe(404)
    })

    test("PUT /users/:id/personal-info", async ({request}) => {
        const payload = getRandomPayloadFor("users/*/personal-info")
        const res = await request.put(`/api/users/${user.id}/personal-info`, { data: payload })
        expect(res.status(), `Expected 404, but got ${res.status()}: ${res.statusText()}`).toBe(404)
    })

    test("PUT /users/:id/membership", async ({request}) => {
        const payload = getRandomPayloadFor("users/:id/membership")
        const res = await request.put(`/api/users/${user.id}/membership`, { data: payload })
        expect(res.status(), `Expected 404, but got ${res.status()}: ${res.statusText()}`).toBe(404)
    })

    test("PUT /users/:id/role", async ({request}) => {
        const payload: UpdateUserRoleBody = { groupName: UserGroup.Administrator }
        const res = await request.put(`/api/users/${user.id}/role`, { data: payload })
        expect(res.status(), `Expected 404, but got ${res.status()}: ${res.statusText()}`).toBe(404)
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

test("PATCH /api/users/deleted/:id", async ({ request }, workerInfo) => { 
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)

    const initialUser = await api.users.createRandom(workerInfo)    // TODO: Set more props on the initial user
    await api.users.delete(workerInfo, initialUser.id)

    const restoreUserData = getRandomPayloadFor("users/deleted/:id")
    const res = await request.patch(`/api/users/deleted/${initialUser.id}`, { data: restoreUserData })
    expect(res.status(), `Expected 200, but got ${res.status()}: ${res.statusText()}`).toBe(200)

    const actualUser = await api.users.get(request, initialUser.id)
    const expectedUser: User = { 
        // New values from the payload
        ...restoreUserData,

        // Values we don't expect to be change
        id: initialUser.id,
        rank: initialUser.rank,
        capeName: initialUser.capeName,
        startDate: initialUser.startDate,
        endDate: initialUser.endDate,

        // Values that should have been erased
        groupId: 1,
        groupName: UserGroup.Contributor,
        status: UserStatus.Active,
        phoneNumber: null,
        birthDate: null,
        
        // Don't compare createdAt and updatedAt
        createdAt: actualUser.createdAt,
        updatedAt: actualUser.updatedAt,
        
    }
    assertEqualUsers(actualUser, expectedUser)

    await api.users.delete(workerInfo, initialUser.id)
})