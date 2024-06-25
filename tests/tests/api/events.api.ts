import { APIRequestContext, expect, test } from '@playwright/test'
import { EventData, NewEventData } from 'common/interfaces'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'
import { apiLogIn } from '../../utils/auth.js'
import { dateTimeSchema } from '../../utils/zodtypes.js'

// ****************************************************
//                  SCHEMA DEFINITIONS
// ****************************************************

const NewEventDataSchema = z.object({
    title: z.string(),
    startDateTime: dateTimeSchema,
    endDateTime: dateTimeSchema.nullable(),
    keyInfo: z.array(z.object({
        key: z.string(),
        value: z.string()
    })),
    description: z.string()
})

const EventDataSchema = NewEventDataSchema.extend({
    id: z.number().int().positive().finite(),
    
    createdBy: z.number().int().positive().finite(),
    createdByName: z.string(),
    createdAt: dateTimeSchema,
    
    updatedBy: z.number().int().positive().finite(),
    updatedByName: z.string(),
    updatedAt: dateTimeSchema,
    
    isUpcoming: z.boolean()
})

const EventDataArraySchema = z.array(EventDataSchema)

const AssertCorrectSchema = () => {
    // Typescript will show a red squiggly line if the inferred schema is not the same as the defined interface
    const _test1: NewEventData = {} as z.infer<typeof NewEventDataSchema>
    const _test2: z.infer<typeof NewEventDataSchema> = {} as NewEventData
    const _test3: EventData = {} as z.infer<typeof EventDataSchema>
    const _test4: z.infer<typeof EventDataSchema> = {} as EventData
}

// ****************************************************
//                      TESTS
// ****************************************************

test.describe("GET /api/events", () => {

    test.beforeEach( async ({request}, workerInfo) => {
        await apiLogIn(request, workerInfo)
    })

    test("Conforms to schema", async ({request}) => {
        const events = await getEvents(request)

        const result = EventDataArraySchema.safeParse(events)
        expect(result.success, fromError(result.error).toString()).toBe(true)
    })

    test("Param: ?limit", async ({request}) => {
        const limit = 2
        const events = await getEvents(request, `?limit=${limit}`)
        expect(events.length).toBe(limit)
    })

    test("Param: filter=upcoming", async ({request}) => { 
        const events = await getEvents(request, "?filter=upcoming")

        for (const event of events) {
            expect(event.isUpcoming).toBe(true)
        }
    })

    test("Param: filter=previous", async ({request}) => { 
        const events = await getEvents(request, "?filter=previous")

        for (const event of events) {
            expect(event.isUpcoming).toBe(false)
        }
    })
})

async function getEvents(request: APIRequestContext, params?: string) {
        const res = await request.get(`/api/events${params ?? ""}`)
        expect(res.ok()).toBeTruthy()
        const events = await res.json()
        return events as EventData[]
}

