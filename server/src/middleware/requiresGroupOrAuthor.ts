import { UserGroup } from "common/enums"
import { NextFunction, Request, Response } from "express"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { hasGroupAccess } from "../utils/accessTokenUtils.js"

export function requiresGroupOrAuthor({
    requiredGroup,
    getAuthorInfo,
}: {
    requiredGroup: UserGroup,
    getAuthorInfo: (id: number) => AuthoredItem | undefined
}) {
    return (req: Request, res: Response, next: NextFunction) => authenticatePermission(req, res, next, requiredGroup, getAuthorInfo)
}

// Check if:
//  1. Item exists.
//  2. The user is admin or, the user is author of the item
function authenticatePermission(
    req: Request,
    res: Response,
    next: NextFunction,
    requiredGroup: UserGroup,
    getAuthorInfo: (id: number) => AuthoredItem | undefined
) {

    // Check if the posted quoteId is valid
    let id: number | unknown | undefined = req.body.id
    if ( (!id && id !== 0) || typeof id !== "number") {
        return res.status(400).send("Bad data")
    }
    let item: AuthoredItem | undefined
    try {
        item = getAuthorInfo(id)
    } catch {
        return res.status(400).send("bad data")
    }

    if(item === undefined || item.createdBy === undefined || item.createdBy < 0)
        return res.status(400).send("bad data");

    // Allow the item to be modified if the user is admin or is original author
    const user = req.user as AccessTokenData
    const hasPrivilege = hasGroupAccess(user, requiredGroup)
    const isAuthor = item.createdBy === user.userId
    if (hasPrivilege || isAuthor) {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}

export interface AuthoredItem {
    createdBy: number
}