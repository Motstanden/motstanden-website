import { Request, Response, NextFunction, CookieOptions } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { AccessTokenData } from '../ts/interfaces/AccessTokenData';
import * as userService from '../services/user';
import { RefreshTokenData } from '../ts/interfaces/RefreshTokenData';
import crypto from "crypto";


export function AuthenticateUser(options?: AuthenticateOptions){
    return (req: Request, res: Response, next: NextFunction) => onAuthenticateRequest(req, res, next, options ?? {}) 
}

function onAuthenticateRequest(req: Request, res: Response, next: NextFunction, options: AuthenticateOptions) {
    const accessToken = getToken(req, TokenType.AccessToken)
    if(accessToken){
        return passport.authenticate("jwt", { session: false, ...options })(req, res, next)
    }
    else {
        return updateAccessToken(req, res, next, options)
    }
}

function updateAccessToken(req: Request, res: Response, next: NextFunction, options: AuthenticateOptions) {

    const onFailure = () => {
        clearAllAuthCookies(res)
        if(options.failureRedirect) {
            return res.redirect(options.failureRedirect)
        }
        return res.status(401).send("Unauthorized").end()
    }

    const refreshToken = getToken(req, TokenType.RefreshToken)
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
    
    const accessToken = createToken(TokenType.AccessToken, user)
    saveTokenInCookie(res, TokenType.AccessToken, accessToken)

    req.user = user
    next()
}

function getToken(req: Request, tokenType: TokenType): string | undefined {
    let token = undefined
    if(req && req.cookies){
        token = req.cookies[tokenType.toString()]     
    }
    return token;
}   


export function createToken(tokenType: TokenType, user: AccessTokenData): string {
    return tokenType === TokenType.AccessToken 
        ? createAccessToken(user)
        : createRefreshToken(user)
}

function createAccessToken(user: AccessTokenData): string {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m"})
}

function createRefreshToken(user: AccessTokenData): string {
    const data = {
        ...user,
        salt: crypto.randomBytes(16).toString("hex")
    } as RefreshTokenData
    return jwt.sign(data,  process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d"})
}

export function loginUser(req: Request, res: Response) {
    const userData = req.user as AccessTokenData

    const accessToken = createToken(TokenType.AccessToken, userData)
    const refreshToken = createToken(TokenType.RefreshToken, userData)

    userService.insertLoginToken(refreshToken)

    saveTokenInCookie(res, TokenType.AccessToken, accessToken)
    saveTokenInCookie(res, TokenType.RefreshToken, refreshToken)
 
    res.redirect("/hjem")
}

function saveTokenInCookie(res: Response, tokenType: TokenType, tokenStr: string | RefreshTokenData){
    const maxAge = tokenType === TokenType.AccessToken
        ? 1000 * 60 * 15                 // 15 min
        : 1000 * 60 * 60 * 24 * 365      // 365 days
    res.cookie( 
        tokenType.toString(),
        tokenStr,
        {
            httpOnly: true, 
            secure: true, 
            sameSite: true,
            maxAge: maxAge
        })
}

export function logOut(req: Request, res: Response) {
    const refreshToken = getToken(req, TokenType.RefreshToken)
    if(refreshToken){
        userService.removeLoginToken(refreshToken)
    }
    clearAllAuthCookies(res)
    res.end()
}

export function logOutAllUnits(req: Request, res: Response) {
    const userData = req.user as AccessTokenData
    userService.removeAllLoginTokens(userData)
    clearAllAuthCookies(res)
    res.end()
}

function clearAllAuthCookies(res: Response){
    res.clearCookie(TokenType.AccessToken.toString())
    res.clearCookie(TokenType.RefreshToken.toString())
}

enum TokenType {
    AccessToken = "AccessToken",
    RefreshToken = "RefreshToken"
}

export interface JwtTokenData extends AccessTokenData, jwt.JwtPayload {
    iat: number;
    exp: number;
}

interface AuthenticateOptions {
    failureRedirect?: string
}