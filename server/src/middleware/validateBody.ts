import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

export function validateBody(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if(result.success) { 
            next()
        } else {
            res.status(400).json(result.error.format());
        }
    };
}