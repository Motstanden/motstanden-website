import { PublicCookieName } from "common/enums";
import { UnsafeUserCookie, User } from "common/interfaces";
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
    const accessToken = getCookie(req, JwtToken.AccessToken)
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

    // Get refresh token and verify it
    const refreshToken = getRefreshToken(req)
    if (!refreshToken.isValid) {
        return onFailure()
    }

    const { accessTokenData, userData } = refreshToken

    // Sign and save access token
    const signedAccessToken = signToken(JwtToken.AccessToken, refreshToken.accessTokenData)
    saveToCookie(res, JwtToken.AccessToken, signedAccessToken)

    // Save unsafe user info
    const userInfo: UnsafeUserCookie = {...userData, expires: refreshToken.expires}
    const userInfoToken = JSON.stringify(userInfo)
    saveToCookie(res, PublicCookieName.UnsafeUserInfo, userInfoToken, { httpOnly: false, expires: new Date(refreshToken.expires)})

    req.user = accessTokenData
    next()
}

function getRefreshToken(req: Request): {
    isValid: true,
    userData: User,
    accessTokenData: AccessTokenData
    expires: Date
} | {
    isValid: false,
    userData: undefined,
    accessTokenData: undefined
    expires: undefined
} {   
    const invalidResult = { 
        isValid: false as const, 
        userData: undefined, 
        accessTokenData: undefined, 
        expires: undefined 
    }

    const srcToken = getCookie(req, JwtToken.RefreshToken)
    if (!srcToken) {
        return invalidResult
    }

    // Check if the token has been tampered with.
    let srcPayload: JwtTokenData
    try {
        srcPayload = jwt.verify(srcToken, process.env.REFRESH_TOKEN_SECRET) as JwtTokenData
    }
    catch {
        return invalidResult
    }

    // Check if the token is active. The token is considered active if it is in the database.
    const isActiveToken = userService.verifyLoginToken(srcToken, srcPayload.userId)
    if (!isActiveToken) {
        return invalidResult
    }

    // Get the user data from the database.
    const user = userService.getUser(srcPayload.userId)
    
    // Quickly validate the user data.
    // It should of course always be valid, but let's be safe since this function is responsible for authentication.
    if(!user || !user.id || !user.groupId || !user.email || !user.groupName) {
        return invalidResult
    }

    const expiry = new Date(srcPayload.exp * 1000)  // Convert from seconds since epoch to milliseconds sinceh epoch

    const result = {
        isValid: true as const,
        userData: user,
        expires: expiry,
        accessTokenData: {
            userId: user.id,
            groupId: user.groupId,
            email: user.email,
            groupName: user.groupName
        }
    }

    return result
}

function getCookie(req: Request, tokenType: JwtToken | PublicCookieName.UnsafeUserInfo): string | undefined {
    let token = undefined
    if (req && req.cookies) {
        token = req.cookies[tokenType.toString()]
    }
    return token;
}

export function signToken(tokenType: JwtToken, user: AccessTokenData): string {
    return tokenType === JwtToken.AccessToken
        ? signAccessToken(user)
        : signRefreshToken(user)
}

function signAccessToken(user: AccessTokenData): string {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}

function signRefreshToken(user: AccessTokenData): string {
    const data: RefreshTokenData = {
        userId: user.userId,
        salt: crypto.randomBytes(16).toString("hex")
    }
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" })
}


export function loginUser(req: Request, res: Response) {

    const accessTokenContent = req.user as AccessTokenData
    const refreshTokenExpiry = getCookieExpiry(JwtToken.RefreshToken)    


    // -- Save access token --
    const accessToken = signToken(JwtToken.AccessToken, accessTokenContent)
    saveToCookie(res, JwtToken.AccessToken, accessToken)


    // -- Save refresh token --
    const refreshToken = signToken(JwtToken.RefreshToken, accessTokenContent)
    userService.insertLoginToken(refreshToken)
    saveToCookie(res, JwtToken.RefreshToken, refreshToken, { expires: refreshTokenExpiry })


    // -- Save 'unsafe' user info
    const userData: UnsafeUserCookie = {
        ...userService.getUser(accessTokenContent.userId),
        expires: refreshTokenExpiry
    }
    const userInfoToken = JSON.stringify(userData)
    saveToCookie(res, PublicCookieName.UnsafeUserInfo, userInfoToken, { expires: refreshTokenExpiry, httpOnly: false})   
}

function saveToCookie(
    res: Response, 
    tokenType: JwtToken |  PublicCookieName.UnsafeUserInfo,
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

function getCookieExpiry(tokenType: JwtToken | PublicCookieName.UnsafeUserInfo ): Date {

    let maxAge: number
    switch(tokenType) {
        case JwtToken.AccessToken:
            maxAge = 1000 * 60 * 15                 // 15 min
            break
        case JwtToken.RefreshToken:
            maxAge = 1000 * 60 * 60 * 24 * 365      // 365 days
            break
        case PublicCookieName.UnsafeUserInfo:
            maxAge = 1000 * 60 * 60 * 24 * 365      // 365 days
            break
    }

    return new Date(Date.now() + maxAge)
}

export function logOut(req: Request, res: Response) {
    const refreshToken = getCookie(req, JwtToken.RefreshToken)
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
    res.clearCookie(PublicCookieName.UnsafeUserInfo.toString(), {sameSite: "strict"})
}

export interface JwtTokenData extends AccessTokenData, jwt.JwtPayload {
    iat: number;
    exp: number;
}

interface AuthenticateOptions {
    failureRedirect?: string
}