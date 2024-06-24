
import { strToNumber } from "common/utils"
import { z } from "zod"

export const StringToIntegerSchema = (message?: string) => { 
    return z.string()
        .trim()
        .transform(strToNumber)
        .refine(val => val !== undefined, { message: message })
        .pipe(
            z.number().int().positive().finite()  
        )
}