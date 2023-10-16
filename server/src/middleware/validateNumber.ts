import { strToNumber } from 'common/utils';
import { NextFunction, Request, Response } from 'express';

export function validateNumber( { 
    getValue,
    failureMessage
}: {
    getValue: (req: Request) => string,
    failureMessage?: string  
}) {
    return (req: Request, res: Response, next: NextFunction) => { 
        const stringValue = getValue(req)
        const numberValue = strToNumber(stringValue)
        if(!numberValue) {
            res.status(400).send(failureMessage ?? "Failed to parse the submitted number")
        } else {
            next()
        }  
    }
} 