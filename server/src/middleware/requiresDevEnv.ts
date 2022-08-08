import { Request, Response, NextFunction } from 'express';

export function requiresDevEnv(req: Request, res: Response, next: NextFunction) {
    if(process.env.IS_DEV_ENV){
        next()
    }
    else {
        res.status(401).send("Unauthorized").end()
    }
} 