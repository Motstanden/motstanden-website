
import { strToNumber } from "common/utils"
import { z } from "zod"

export const StringToInt = (message?: string) => { 
    return z.string()
        .trim()
        .transform(strToNumber)
        .refine(val => val !== undefined, { message: message })
        .pipe(
            z.number().int().positive().finite()
        )
}


export const Schemas = {
    utils: {
        StringToInt: StringToInt,
    },

    params: {
        id: z.object({
            id: StringToInt("id param must be a positive integer")
        })  
    },
}