import { APIRequestContext, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { NewUser, User } from 'common/interfaces'
import { randomUUID } from 'crypto'
import { z } from "zod"
import dayjs from "../../lib/dayjs.js"
import { apiLogIn } from '../../utils/auth.js'
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
            firstName: "__Test",
            middleName: "User",
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
            startDate: dayjs().format("YYYY-MM-DD"),    // TODO: Convert this to utc
            endDate: null,  
            
            // createdAt and updatedAt are not known in advance
            createdAt: actualUser.createdAt,
            updatedAt: actualUser.updatedAt,
        }

        assertEqualUsers(actualUser, expectedUser)
        user = actualUser
    })

    test("PATCH /api/users/me", async ({request}, workerInfo) => { 
        throw "Not implemented"
    })

    test.describe.serial("PUT /api/users/:id/role", () => { 

        test("Admin can promote to admin", async ({request}, workerInfo) => { 
            throw "Not implemented"
        })

        test("Admin can not promote to super admin", async ({request}, workerInfo) => { 
            throw "Not implemented"
        })

        test("Super admin can promote to super admin", async ({request}, workerInfo) => { 
            throw "Not implemented"
        })

        test("Admin can not demote super admin", async ({request}, workerInfo) => { 
            throw "Not implemented"
        })

        test("Super admin can demote super admin", async ({request}, workerInfo) => { 
            throw "Not implemented"
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