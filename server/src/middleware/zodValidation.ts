import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'


export function validateBody(schema: z.ZodSchema) { 
    return validate({ 
        schema: schema,
        data: req => req.body,
        error: { 
            code: 400,
            message: "Invalid request body" 
        },
        onSuccess: (req, body) => {
            req.body = body
        }
    })
}

export function validateQuery(schema: z.ZodSchema) { 
    return validate({
        schema: schema,
        data: req => req.query,
        error: { 
            code: 400, 
            message: "Invalid request query" 
        }
    })
}

export function validateParams(schema: z.ZodSchema) { 
    return validate({
        schema: schema,
        data: req => req.params,
        error: { 
            code: 400, 
            message: "Invalid request params" 
        }
    })
}

function validate<T>({
    schema,
    data,
    onSuccess,
    error = { code: 400, message: "Invalid request" }
}: {
    schema: z.ZodSchema<T>
    data: (req: Request) => any,
    onSuccess?: (req: Request, data: T) => void
    error: {
        code: number,
        message: string
    }
}) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(data)
        if(result.success) { 
            onSuccess?.(req, result.data)
            next()
        } else {
            res.status(error.code).json({
                message: error.message,
                error: fromError(result.error).toString()
            });
        }
    }
}

