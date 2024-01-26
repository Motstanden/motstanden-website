import { PublicCookieName } from "common/enums";
import crypto from "crypto";
import { CookieOptions, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import * as userService from '../services/user.js';
import { AccessTokenData } from '../ts/interfaces/AccessTokenData.js';
import { RefreshTokenData } from '../ts/interfaces/RefreshTokenData.js';

enum JwtToken {
    AccessToken = "AccessToken",
    RefreshToken = "RefreshToken"
}

export function AuthenticateUser(options?: AuthenticateOptions) {
    return (req: Request, res: Response, next: NextFunction) => onAuthenticateRequest(req, res, next, options ?? {})
}

function onAuthenticateRequest(req: Request, res: Response, next: NextFunction, options: AuthenticateOptions) {
    const accessToken = getToken(req, JwtToken.AccessToken)
    if (accessToken) {
        return passport.authenticate("jwt", { session: false, ...options })(req, res, next)
    }
    else {
        return updateAccessToken(req, res, next, options)
    }
}

export function updateAccessToken(req: Request, res: Response, next: NextFunction, options: AuthenticateOptions) {

    const onFailure = () => {
        clearAllAuthCookies(res)
        if (options.failureRedirect) {
            return res.redirect(options.failureRedirect)
        }
        return res.status(401).send("Unauthorized").end()
    }

    const refreshToken = getToken(req, JwtToken.RefreshToken)
    if (!refreshToken) {
        return onFailure()
    }

    const expireToken = !!getToken(req, PublicCookieName.RefreshTokenExpiry)
    if(!expireToken) {
        return onFailure()
    }

    let payload: JwtTokenData
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtTokenData
    }
    catch {
        return onFailure()
    }

    const validToken = userService.verifyLoginToken(refreshToken, payload.userId)
    if (!validToken) {
        return onFailure()
    }

    const user = userService.getTokenDataFromId(payload.userId)
    const accessToken = createToken(JwtToken.AccessToken, user)
    saveTokenInCookie(res, JwtToken.AccessToken, accessToken)

    req.user = user
    next()
}

function getToken(req: Request, tokenType: JwtToken | PublicCookieName.RefreshTokenExpiry): string | undefined {
    let token = undefined
    if (req && req.cookies) {
        token = req.cookies[tokenType.toString()]
    }
    return token;
}


export function createToken(tokenType: JwtToken, user: AccessTokenData): string {
    return tokenType === JwtToken.AccessToken
        ? createAccessToken(user)
        : createRefreshToken(user)
}

function createAccessToken(user: AccessTokenData): string {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

function createRefreshToken(user: AccessTokenData): string {
    const data = {
        userId: user.userId,
        salt: crypto.randomBytes(16).toString("hex")
    } as RefreshTokenData
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" })
}

export function loginUser(req: Request, res: Response) {
    const userData = req.user as AccessTokenData

    const accessToken = createToken(JwtToken.AccessToken, userData)
    const refreshToken = createToken(JwtToken.RefreshToken, userData)

    userService.insertLoginToken(refreshToken)
    
    const refreshCookieExpiry = getCookieExpiry(JwtToken.RefreshToken)    

    saveTokenInCookie(res, JwtToken.AccessToken, accessToken)
    saveTokenInCookie(res, JwtToken.RefreshToken, refreshToken, { expires: refreshCookieExpiry })
    saveTokenInCookie(res, PublicCookieName.RefreshTokenExpiry, refreshCookieExpiry.toUTCString(), { expires: refreshCookieExpiry, httpOnly: false})
}

function saveTokenInCookie(
    res: Response, 
    tokenType: JwtToken |  PublicCookieName.RefreshTokenExpiry,
    tokenData: string,
    opts?: CookieOptions
) {
    res.cookie(
        tokenType.toString(),
        tokenData,
        {
            httpOnly: true,
            secure: process.env.IS_DEV_ENV === "true" ? false : true,       // In development we need this to be true in order to log in to the site from a mobile phone
            sameSite: "strict",
            expires: getCookieExpiry(tokenType),
            encode: (val) => val,
            ...opts
        })
}

function getCookieExpiry(tokenType: JwtToken | PublicCookieName.RefreshTokenExpiry ): Date {

    let maxAge: number
    switch(tokenType) {
        case JwtToken.AccessToken:
            maxAge = 1000 * 60 * 15                 // 15 min
            break
        case JwtToken.RefreshToken:
            maxAge = 1000 * 60 * 60 * 24 * 365      // 365 days
            break
        case PublicCookieName.RefreshTokenExpiry:
            maxAge = 1000 * 60 * 60 * 24 * 365      // 365 days
            break
    }

    return new Date(Date.now() + maxAge)
}

export function logOut(req: Request, res: Response) {
    const refreshToken = getToken(req, JwtToken.RefreshToken)
    if (refreshToken) {
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

function clearAllAuthCookies(res: Response) {
    res.clearCookie(JwtToken.AccessToken.toString(), {sameSite: "strict"})
    res.clearCookie(JwtToken.RefreshToken.toString(), {sameSite: "strict"})
    res.clearCookie(PublicCookieName.RefreshTokenExpiry.toString(), {sameSite: "strict"})
}

export interface JwtTokenData extends AccessTokenData, jwt.JwtPayload {
    iat: number;
    exp: number;
}

interface AuthenticateOptions {
    failureRedirect?: string
}