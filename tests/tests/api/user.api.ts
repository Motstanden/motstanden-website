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

test.describe("GET api/member-list", () => {
    
    const getValues = async (request: APIRequestContext) => await request.get("/api/member-list")

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

test.describe("GET api/simplified-member-list", () => {

    const getValues = async (request: APIRequestContext) => await request.get("/api/simplified-member-list")

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