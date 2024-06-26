import { APIRequestContext, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { z } from "zod"
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
    
    test("POST /api/users", async ({request}, workerInfo) => { 
        throw "Not implemented"
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