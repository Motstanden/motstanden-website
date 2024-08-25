import Playwright, { APIRequestContext, APIResponse, TestInfo, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { DeletedUser, NewUser, UpdateUserAsSuperAdminBody, UpdateUserMembershipAsAdminBody, UpdateUserPersonalInfoBody, UpdateUserRoleBody, User } from 'common/interfaces'
import { randomInt, randomUUID } from 'crypto'
import { z } from "zod"
import dayjs from "../../lib/dayjs.js"
import { api } from '../../utils/api/index.js'
import { apiLogIn, getUser as getTestUser, unsafeApiLogIn } from '../../utils/auth.js'
import { dateTimeSchema } from '../../utils/zodtypes.js'

const userSchema = z.object({ 
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    profilePicture: z.string(),
    id: z.number(),
    groupId: z.number(),
    groupName: z.nativeEnum(UserGroup),
    rank: z.nativeEnum(UserRank),
    capeName: z.string(),
    status: z.nativeEnum(UserStatus),
    phoneNumber: z.number().min(10000000).max(99999999).nullable(),
    birthDate: z.string().date().nullable(),
    startDate: z.string().date(),
    endDate: z.string().date().nullable(),
    createdAt: dateTimeSchema,
    updatedAt: dateTimeSchema,
})

const userArraySchema = z.array(userSchema)

const simplifiedUserSchema = z.object({
    id: z.number(),
    fullName: z.string(),
    initials: z.string().min(2).max(3),
})

const simplifiedUserArraySchema = z.array(simplifiedUserSchema)

test.describe("GET api/users", () => {
    
    test("Receives valid object", async ({request}, workerInfo) => {
        await apiLogIn(request, workerInfo)
        const users = await api.users.getAll(request)
        expect( () => userArraySchema.parse(users)).not.toThrow()
    })

    test("Refuses unauthenticated requests", async ({request}) => { 
        const res = await request.get("/api/users")
        expect(res.ok()).toBeFalsy()
    })
})

test.describe("GET api/users/identifiers", () => {

    test("Returns valid object", async ({request}, workerInfo) => {
        await apiLogIn(request, workerInfo)
        const users = await api.users.getAllIdentifiers(request)
        expect(() => simplifiedUserArraySchema.parse(users)).not.toThrow()
    })

    test("Returns unauthenticated requests", async ({request}) => { 
        const res = await request.get("/api/users/identifiers")
        expect(res.ok()).toBeFalsy()
    })
})


test("POST /api/users", async ({request}, workerInfo) => { 
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)

    const uuid: string = randomUUID().toLowerCase()
    const newUser: NewUser = {
        firstName: "__Test_1",
        middleName: "User_1",
        lastName: uuid,
        email: `${uuid}@motstanden.no`,
        profilePicture: "files/private/profilbilder/girl.png"
    }

    const id = await api.users.create(request, newUser)
    const actualUser = await api.users.get(request, id)

    const expectedUser: User = { 
        ...newUser,
        id: id,
        groupId: 1,
        groupName: UserGroup.Contributor,
        rank: UserRank.ShortCircuit,
        capeName: "",
        status: UserStatus.Active,
        phoneNumber: null,
        birthDate: null,
        startDate: dayjs().utc().format("YYYY-MM-DD"),
        endDate: null,  
        
        // createdAt and updatedAt are not known in advance
        createdAt: actualUser.createdAt,
        updatedAt: actualUser.updatedAt,
    }

    assertEqualUsers(actualUser, expectedUser)

    await api.users.delete(workerInfo, id)
})

test.describe("DELETE /api/users/:id", () => { 
    
    let user: User

    test.beforeAll(async ({}, workerInfo) => { 
        user = await api.users.createRandom(workerInfo)
        await api.users.delete(workerInfo, user.id)
    })

    test.beforeEach(async ({request}, workerInfo) => { 
        await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
    })

    test("GET /api/users/:id", async ({request}) => { 
        const res = await request.get(`/api/users/${user.id}`)
        expect(res.status(), `Expected 404, but got ${res.status()}: ${res.statusText()}`).toBe(404)
    })

    test("GET api/users", async ({request}) => {
        const allUsers = await api.users.getAll(request)
        const deletedUser = allUsers.find(u => u.id === user.id)
        expect(deletedUser).toBeUndefined()
    })

    test("GET api/users/identifiers", async ({request}) => {
        const allUsers = await api.users.getAllIdentifiers(request)
        const deleteUser = allUsers.find(u => u.id === user.id)
        expect(deleteUser).toBeUndefined()
    })

    test("GET api/users/deleted", async ({request}) => {
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

test("DELETE /api/users/me", async ({request}, workerInfo) => { 

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

test("PATCH /api/users/me/personal-info", async ({request}, workerInfo) => { 

    const user = await api.users.createRandom(workerInfo)

    // Log in as the new user
    await unsafeApiLogIn(request, user.email)

    // Post new random user data
    const uuid: string = randomUUID().toLowerCase()
    const newUserData: UpdateUserPersonalInfoBody = {
        firstName: `___firstName ${uuid}`,
        middleName: `___middleName ${uuid}`,
        lastName: `___lastName ${uuid}`,
        email: `${uuid}@motstanden.no`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: dayjs().subtract(20, "years").utc().format("YYYY-MM-DD"),
    }
    await updateUser(request, { type: "my-personal-info", data: newUserData })

    const actualUser = await api.users.get(request, user.id)
    const expectedUser: User = { ...user, ...newUserData,}

    assertEqualUsers(actualUser, expectedUser)

    await api.users.delete(workerInfo, actualUser.id)
})

test("PATCH /api/users/:id", async ({request}, workerInfo) => { 
    const user = await api.users.createRandom(workerInfo)
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
    
    const uuid: string = randomUUID().toLowerCase()
    const newUserData: UpdateUserAsSuperAdminBody = {
        firstName: `___firstName ${uuid}`,
        middleName: `___middleName ${uuid}`,
        lastName: `___lastName ${uuid}`,
        email: `${uuid}@motstanden.no`,
        groupName: UserGroup.Editor,
        status: UserStatus.Inactive,
        rank: UserRank.KiloOhm,
        capeName: `___capeName ${uuid}`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: dayjs().subtract(25, "years").utc().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(5, "years").utc().format("YYYY-MM-DD"),
        endDate: dayjs().subtract(2, "years").utc().format("YYYY-MM-DD"),
    } 
    await updateUser(request, { type: "superadmin", data: newUserData, id: user.id })

    const actualUser = await api.users.get(request, user.id)
    const expectedUser: User = { ...user, ...newUserData,}

    assertEqualUsers(actualUser, expectedUser)

    // Clean up: Delete the user that was created
    await api.users.delete(workerInfo, actualUser.id)
})


test("PUT /api/users/:id/membership", async ({request}, workerInfo) => { 
    const user = await api.users.createRandom(workerInfo)
    await apiLogIn(request, workerInfo, UserGroup.Administrator)

    const uuid: string = randomUUID().toLowerCase()
    const newUserData: UpdateUserMembershipAsAdminBody = { 
        rank: UserRank.GigaOhm,
        capeName: `___capeName ${uuid}`,
        status: UserStatus.Retired,
        startDate: dayjs().subtract(6, "years").utc().format("YYYY-MM-DD"),
        endDate: dayjs().subtract(3, "years").utc().format("YYYY-MM-DD"),
    }
    await updateUser(request, { type: "membership", data: newUserData, id: user.id })

    const actualUser = await api.users.get(request, user.id)
    const expectedUser: User = { ...user, ...newUserData,}

    assertEqualUsers(actualUser, expectedUser)
})

test.describe("PUT /api/users/:id/role", () => { 

    testCanUpdateRole({
        title: "Admin can promote to admin",
        currentUserRole: UserGroup.Administrator,
        targetNewRole: UserGroup.Administrator
    })

    testCanUpdateRole({
        title: "Super admin can promote to super admin",
        currentUserRole: UserGroup.SuperAdministrator, 
        targetNewRole: UserGroup.SuperAdministrator
    })

    testCanUpdateRole({
        title: "Super admin can demote super admin",
        currentUserRole: UserGroup.SuperAdministrator,
        targetNewRole: UserGroup.Contributor
    })

    testCanNotUpdateRole({
        title: "Admin can not promote to super admin",
        currentUserRole: UserGroup.Administrator,
        targetInitialRole: UserGroup.Contributor,
        targetNewRole: UserGroup.SuperAdministrator
    })

    testCanNotUpdateRole({
        title: "Admin can not demote super admin",
        currentUserRole: UserGroup.Administrator,
        targetInitialRole: UserGroup.SuperAdministrator,
        targetNewRole: UserGroup.Contributor
    })

    async function testCanUpdateRole({
        title, currentUserRole, targetNewRole
    }: {
        title: string,
        currentUserRole: UserGroup,
        targetNewRole: UserGroup
    }) { 
    
        test(title, async ({request}, workerInfo) => {
            
            // Create new user
            const user = await api.users.createRandom(workerInfo)
            expect(user.groupName).toBe(UserGroup.Contributor)
    
            // Log in with the permissions of current user
            await apiLogIn(request, workerInfo, currentUserRole)
    
            const res = await updateRole(request, user, targetNewRole)
            expect(res.ok(), `Failed to update role\n${res.status()}: ${res.statusText()}`).toBeTruthy()
    
            const updatedUser = await api.users.get(request, user.id)
            expect(updatedUser.groupName).toBe(targetNewRole)

            // Clean up: Delete the user that was created
            await api.users.delete(workerInfo, updatedUser.id)
        })
    }
    
    async function testCanNotUpdateRole({
        title, currentUserRole, targetInitialRole, targetNewRole
    }: {
        title: string,
        currentUserRole: UserGroup,
        targetInitialRole: UserGroup,
        targetNewRole: UserGroup
    }) { 
    
        const updateRoleAsSuperAdmin = async (workerInfo: TestInfo, user: User, newGroup: UserGroup) => { 
            const superAdmin = getTestUser(workerInfo, UserGroup.SuperAdministrator)
            const request = await Playwright.request.newContext( { storageState: superAdmin.storageStatePath } )
            await updateRole(request, user, newGroup)
            await request.dispose()
        }
    
        test(title, async ({request}, workerInfo) => { 
    
            // Create new user
            const user = await api.users.createRandom(workerInfo)
            expect(user.groupName).toBe(UserGroup.Contributor)
    
            // Force user to have the initial role
            await updateRoleAsSuperAdmin(workerInfo, user, targetInitialRole)
    
            // Log in with the permissions of current user
            await apiLogIn(request, workerInfo, currentUserRole)
    
            // Assert that the user has the initial role
            const user2 = await api.users.get(request, user.id)
            expect(user2.groupName).toBe(targetInitialRole)
    
            // Try to update role
            const res = await updateRole(request, user, targetNewRole)
            expect(res.status(), `Expected 403 forbidden but got ${res.status()} ${res.statusText()}`).toBe(403)
    
            // Assert role has not changed
            const user3 = await api.users.get(request, user.id)
            expect(user3.groupName).toBe(targetInitialRole)

            // Clean up: Delete the user that was created
            await api.users.delete(workerInfo, user.id)
        })
    }
    
    async function updateRole(request: APIRequestContext, user: User, newGroup: UserGroup) { 
        const body: UpdateUserRoleBody = {
            groupName: newGroup
        }
        const res = await request.put(`/api/users/${user.id}/role`, { data: body })
        return res
    }
})

function assertEqualUsers(actual: User, expected: User) { 
    expect(actual.id).toBe(expected.id)
    expect(actual.firstName).toBe(expected.firstName)
    expect(actual.middleName).toBe(expected.middleName)
    expect(actual.lastName).toBe(expected.lastName)
    expect(actual.email).toBe(expected.email)
    expect(actual.profilePicture).toBe(expected.profilePicture)
    expect(actual.groupName).toBe(expected.groupName)
    expect(actual.rank).toBe(expected.rank)
    expect(actual.capeName).toBe(expected.capeName)
    expect(actual.status).toBe(expected.status)
    expect(actual.phoneNumber).toBe(expected.phoneNumber)
    expect(actual.birthDate).toBe(expected.birthDate)
    expect(actual.startDate).toBe(expected.startDate)
    expect(actual.endDate).toBe(expected.endDate)

    // No need to compare createdAt and updatedAt
}

type UpdateType = {
    type: "my-personal-info",
    data: UpdateUserPersonalInfoBody
    id?: never
} | {
    type: "membership",
    data: UpdateUserMembershipAsAdminBody
    id: number
} | {
    type: "superadmin",
    data: UpdateUserAsSuperAdminBody
    id: number
}

async function updateUser(request: APIRequestContext,  {type, data, id} : UpdateType)  {
    let res: APIResponse 
    switch(type) { 
        case "my-personal-info":
            res = await request.put("/api/users/me/personal-info", { data: data })
            break
        case "membership":
            res = await request.put(`/api/users/${id}/membership`, { data: data })
            break
        case "superadmin":
            res = await request.patch(`/api/users/${id}`, { data: data })
            break
    }
    if(!res.ok()) {
        throw new Error(`Failed to update user.\n${res.status()}: ${await res.text()}`)
    }
}