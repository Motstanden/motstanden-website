import { UserGroup } from "common/enums"
import { NextFunction, Request, Response } from "express"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { hasGroupAccess } from "../utils/accessTokenUtils.js"

interface requiresGroupOrAuthorProps {
    requiredGroup: UserGroup,
    getId: (req: Request) => number | unknown | undefined,
    getAuthorInfo: (id: number) => AuthoredItem    
}

export function requiresGroupOrAuthor(options: requiresGroupOrAuthorProps) {
    return (req: Request, res: Response, next: NextFunction) => authenticatePermission(req, res, next, options)
}

// Check if:
//  1. Item exists.
//  2. The user is admin or, the user is author of the item
function authenticatePermission(
    req: Request,
    res: Response,
    next: NextFunction,
    { requiredGroup, getId, getAuthorInfo }: requiresGroupOrAuthorProps
) {

    // Check if the posted quoteId is valid
    let id: number | unknown | undefined = getId(req)
    if (!id || typeof id !== "number") {
        return res.status(400).send("Bad data")
    }
    let item: AuthoredItem
    try {
        item = getAuthorInfo(id)
    } catch {
        return res.status(400).send("bad data")
    }

    // Allow quote to be modified if the user is admin or is original author
    const user = req.user as AccessTokenData
    const hasPrivilege = hasGroupAccess(user, requiredGroup)
    const isAuthor = item.createdBy === user.userId
    if (hasPrivilege || isAuthor) {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}

interface AuthoredItem {
    id: number,
    createdBy: number
}