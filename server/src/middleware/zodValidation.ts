import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

export function validateBody<T>(schema: z.ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if(result.success) { 
            req.body = result.data
            next()
        } else {
            res.status(400).json({
                message: "Invalid request body",
                error: fromError(result.error).toString()
            });
        }
    }
}