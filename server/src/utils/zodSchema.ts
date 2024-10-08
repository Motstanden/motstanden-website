
import { strToNumber } from "common/utils"
import { z } from "zod"

const stringToInt = (message?: string) => { 
    return z.string()
        .trim()
        .transform(strToNumber)
        .refine(val => val !== undefined, { message: message })
        .pipe(
            z.number().int().positive().finite()
        )
}

const dateTime = (message?: string) => {
    return z.string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, message ?? "Must match the date time format: YYYY-MM-DD HH:MM:SS");
}

export const Schemas = {
    z: {
        stringToInt: stringToInt,
        dateTime: dateTime
    },

    params: {
        id: z.object({
            id: stringToInt("id param must be a positive integer")
        }),  
    },

    queries: {
        limit: z.object({
            limit: stringToInt("Limit must be a positive integer").optional()
        })
    }
}