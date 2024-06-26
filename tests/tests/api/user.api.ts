import { APIRequestContext, APIResponse, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { NewUser, User, UserUpdateAsSelf, UserUpdateMembership, UserUpdateRole } from 'common/interfaces'
import { randomUUID } from 'crypto'
import { z } from "zod"
import dayjs from "../../lib/dayjs.js"
import { apiLogIn, unsafeApiLogIn } from '../../utils/auth.js'
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
    
    const getValues = async (request: APIRequestContext) => await request.get("/api/users")

    test("Receives valid object", async ({request}, workerInfo) => {
        await apiLogIn(request, workerInfo)
        
        const res = await getValues(request)
        expect(res.ok()).toBeTruthy()
    
        const users = await res.json()
        expect( () => userArraySchema.parse(users)).not.toThrow()
    })

    test("Refuses unauthenticated requests", async ({request}) => { 
        const res = await getValues(request)
        expect(res.ok()).toBeFalsy()
    })
})

test.describe("GET api/users/identifiers", () => {

    const getValues = async (request: APIRequestContext) => await request.get("/api/users/identifiers")

    test("Returns valid object", async ({request}, workerInfo) => {
        await apiLogIn(request, workerInfo)

        const res = await getValues(request)
        expect(res.ok()).toBeTruthy()

        const users = await res.json()
        expect(() => simplifiedUserArraySchema.parse(users)).not.toThrow()
    })

    test("Returns unauthenticated requests", async ({request}) => { 
        const res = await getValues(request)
        expect(res.ok()).toBeFalsy()
    })
})

test.describe.serial("Create and update user", () => {
    
    let user: User 

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

        const id = await createUser(request, newUser)
        const actualUser = await getUser(request, id)

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
        user = actualUser
    })

    test("PATCH /api/users/me", async ({request}) => { 
        await unsafeApiLogIn(request, user.email)

        const uuid: string = randomUUID().toLowerCase()
        const updatedData: UserUpdateAsSelf = {
            firstName: "___Test_2",
            middleName: "___User_2",
            lastName: uuid,
            email: `${uuid}@motstanden.no`,
            phoneNumber: 12345678,
            birthDate: dayjs().subtract(20, "years").utc().format("YYYY-MM-DD"),
            startDate: dayjs().subtract(3, "years").utc().format("YYYY-MM-DD"),
            endDate: dayjs().subtract(1, "years").utc().format("YYYY-MM-DD"),
        }

        await updateUser(request, { type: "self", data: updatedData })
        const actualUser = await getUser(request, user.id)
        const expectedUser: User = {
            ...user,
            ...updatedData,
            updatedAt: actualUser.updatedAt,
            createdAt: actualUser.createdAt,
        }

        assertEqualUsers(actualUser, expectedUser)
        user = actualUser
    })

    test.describe.serial("PUT /api/users/:id/role", () => { 

        test("Admin can promote to admin", async ({request}, workerInfo) => { 
            await apiLogIn(request, workerInfo, UserGroup.Administrator)
            user = await testUpdateRole(request, user, UserGroup.Administrator)
        })

        test("Admin can not promote to super admin", async ({request}, workerInfo) => { 
            await apiLogIn(request, workerInfo, UserGroup.Administrator)
            await testForbiddenUpdateRole(request, user, UserGroup.SuperAdministrator)
        })

        test("Super admin can promote to super admin", async ({request}, workerInfo) => { 
            await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
            user = await testUpdateRole(request, user, UserGroup.SuperAdministrator)
        })

        test("Admin can not demote super admin", async ({request}, workerInfo) => { 
            await apiLogIn(request, workerInfo, UserGroup.Administrator)
            await testForbiddenUpdateRole(request, user, UserGroup.Contributor)
        })

        test("Super admin can demote super admin", async ({request}, workerInfo) => { 
            await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
            user = await testUpdateRole(request, user, UserGroup.Contributor)
        })
    })
    
    test("PUT /api/users/:id/membership", async ({request}, workerInfo) => { 
        throw "Not implemented"
    })

    test("PATCH /api/users/:id", async ({request}, workerInfo) => { 
        throw "Not implemented"
    })
})


function assertEqualUsers(user1: User, user2: User) { 
    expect(user1.id).toBe(user2.id)
    expect(user1.firstName).toBe(user2.firstName)
    expect(user1.middleName).toBe(user2.middleName)
    expect(user1.lastName).toBe(user2.lastName)
    expect(user1.email).toBe(user2.email)
    expect(user1.profilePicture).toBe(user2.profilePicture)
    expect(user1.groupId).toBe(user2.groupId)
    expect(user1.groupName).toBe(user2.groupName)
    expect(user1.rank).toBe(user2.rank)
    expect(user1.capeName).toBe(user2.capeName)
    expect(user1.status).toBe(user2.status)
    expect(user1.phoneNumber).toBe(user2.phoneNumber)
    expect(user1.birthDate).toBe(user2.birthDate)
    expect(user1.startDate).toBe(user2.startDate)
    expect(user1.endDate).toBe(user2.endDate)

    // No need to compare createdAt and updatedAt
}

interface TestPromoteArgs {
    request: APIRequestContext
    user: User
    newGroup: UserGroup
}

async function testUpdateRole(request: APIRequestContext, user: User, newGroup: UserGroup ): Promise<User> { 
    const res = await updateRole(request, user, newGroup)
    expect(res.ok(), `Failed to update role\n${res.status()}: ${res.statusText()}`).toBeTruthy()
    
    const updatedUser = await getUser(request, user.id)
    expect(updatedUser.groupName).toBe(newGroup)
    
    return updatedUser
}

async function testForbiddenUpdateRole(request: APIRequestContext, user: User, newGroup: UserGroup ) { 
    const res = await updateRole(request, user, newGroup)
    expect(res.status(), `Expected 403 forbidden but got ${res.status()} ${res.statusText()}`).toBe(403)
    const updatedUser = await getUser(request, user.id)
    expect(updatedUser.groupName).not.toBe(newGroup)
}

async function updateRole(request: APIRequestContext, user: User, newGroup: UserGroup) { 
    const body: UserUpdateRole = {
        groupName: newGroup
    }
    const res = await request.put(`/api/users/${user.id}/role`, { data: body })
    return res
}

async function createUser(request: APIRequestContext, newUser: NewUser) {
    const res = await request.post("/api/users", { data: newUser })
    if(!res.ok()) {
        throw new Error(`Failed to create user.\n${res.status()}: ${await res.text()}`)
    }

    const resultData = await res.json()
    const id = resultData?.userId

    if(id === undefined || typeof id !== "number" || id <= 0 || isNaN(id)) { 
        throw new Error(`Expected to get a valid user id, but got: ${id}.`)
    }

    return id
}

async function getUser(request: APIRequestContext, id: number) {
    const res = await request.get(`/api/users/${id}`)
    if(!res.ok()) {
        throw new Error(`Failed to get user ${id}.\n${res.status()}: ${res.statusText()}`)
    }
    const user = await res.json() as User
    return user
}

type UpdateType = {
    type: "self",
    data: UserUpdateAsSelf
} | {
    type: "membership",
    data: UserUpdateMembership
} | {
    type: "superadmin",
    data: UserUpdateMembership
}

async function updateUser(request: APIRequestContext,  {type, data} : UpdateType)  {
    let res: APIResponse 
    switch(type) { 
        case "self":
            res = await request.patch("/api/users/me", { data: data })
            break
        case "membership":
            res = await request.put("/api/users/:id/membership", { data: data })
            break
        case "superadmin":
            res = await request.patch("/api/users/:id/membership", { data: data })
            break
    }
    if(!res.ok()) {
        throw new Error(`Failed to update user.\n${res.status()}: ${await res.text()}`)
    }
}