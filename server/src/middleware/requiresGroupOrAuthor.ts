import { UserGroup } from "common/enums"
import { Request, Response, NextFunction } from "express"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData"
import { hasGroupAccess } from "../utils/accessTokenUtils"
import { AuthenticateUser } from "./jwtAuthenticate"

export function requiresGroupOrAuthor({ 
    requiredGroup,
    getAuthorInfo, 
}: {
    requiredGroup: UserGroup,
    getAuthorInfo: (id: number) => AuthoredItem
}) {
    return ( req: Request, res: Response, next: NextFunction) =>  authenticatePermission(req, res, next, requiredGroup, getAuthorInfo)
}

// Check if:
//  1. Item exists.
//  2. The user is admin or, the user is author of the item
function authenticatePermission(
    req: Request, 
    res: Response, 
    next: NextFunction, 
    requiredGroup: UserGroup, 
    getAuthorInfo: (id: number) => AuthoredItem
) {
    
    // Check if the posted quoteId is valid
    let id: number | unknown = req.body.id
    if(!id || typeof id !== "number"){
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
    if(hasPrivilege || isAuthor) {
        next()
    } else {
        res.status(401).send("Unauthorized")
    }
}

interface AuthoredItem {
    id: number,
    createdBy: number
}