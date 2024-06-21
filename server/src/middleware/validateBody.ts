import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function validateBody<T>(schema: z.ZodSchema<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if(result.success) { 
            req.body = result.data
            next()
        } else {
            res.status(400).json(result.error.format());
        }
    }
}