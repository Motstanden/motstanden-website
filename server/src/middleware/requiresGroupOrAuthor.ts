import { UserGroup } from "common/enums"
import { NextFunction, Request, Response } from "express"
import { AccessTokenData } from "../ts/interfaces/AccessTokenData.js"
import { hasGroupAccess } from "../utils/accessTokenUtils.js"

interface requiresGroupOrAuthorProps {
    requiredGroup: UserGroup,
    getId: (req: Request) => number | undefined,
    getAuthorInfo: (id: number) => AuthoredItem | undefined   
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

    // Check if the id is a number
    let id: unknown = getId(req)
    if (!id || typeof id !== "number") {
        return res.status(400).send("Bad data")
    }

    // Get current user
    const user = req.user as AccessTokenData | undefined
    if(user?.userId === undefined) {
        // This should never happen, but if it does, it's a critical error!
        console.error(`PANIC!! This url requires authentication but the user is not authenticated.\n\tUrl: ${req.url}`)
        return res.status(401).send("Unauthorized")
    }

    // Get the item from the database
    let item: AuthoredItem | undefined
    try {
        item = getAuthorInfo(id)
    } catch {
        return res.status(400).send("Something went wrong")
    }
    if(item?.createdBy === undefined)
        return res.status(404).send("Item not found")


    // Allow access if the user has the right privileges or is the author of the item
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