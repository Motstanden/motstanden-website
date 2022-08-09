import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { AccessTokenData } from '../ts/interfaces/AccessTokenData';
import * as userService from '../services/user';


export function AuthenticateUser(options?: AuthenticateOptions){
    return (req: Request, res: Response, next: NextFunction) => onAuthenticateRequest(req, res, next, options ?? {}) 
}

function onAuthenticateRequest(req: Request, res: Response, next: NextFunction, options: AuthenticateOptions) {
    const accessToken = getToken(req, "AccessToken")
    if(accessToken){
        return passport.authenticate("jwt", { session: false, ...options })(req, res, next)
    }
    else {
        return updateAccessToken(req, res, next, options)
    }
}

function updateAccessToken(req: Request, res: Response, next: NextFunction, options: AuthenticateOptions) {

    const onFailure = () => {
        if(options.failureRedirect) {
            return res.redirect(options.failureRedirect)
        }
        return res.status(401).send("Unauthorized").end()
    }

    const refreshToken = getToken(req, "RefreshToken")
    if(!refreshToken){
        return onFailure()
    }
    
    let payload: JwtTokenData
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtTokenData
    }
    catch {
        return onFailure()
    }

    const user: AccessTokenData = { 
        userId: payload.userId,
        email: payload.email,
        groupId: payload.groupId,
        groupName: payload.groupName  
    }

    const validToken = userService.verifyLoginToken(refreshToken, user)

    if(!validToken){
        return onFailure()
    }
    
    createAccessTokenCookie(user, res)
    req.user = user
    next()
}

function getToken(req: Request, key: string): string | undefined {
    let token = undefined
    if(req && req.cookies){
        token = req.cookies[key]     
    }
    return token;
}   

function createAccessTokenCookie(user: AccessTokenData,  res: Response ): void {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s"})
    res.cookie("AccessToken", 
        token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: true, 
            maxAge: 1000 * 10  // 10m
    })
}

interface JwtTokenData extends AccessTokenData, jwt.JwtPayload {
    iat: number;
    exp: number;
}

interface AuthenticateOptions {
    failureRedirect?: string
}