import { UserGroup } from "common/enums"
import { NextFunction, Request, Response } from 'express'
import { AccessTokenData } from '../ts/interfaces/AccessTokenData.js'
import { AuthoredItem } from '../ts/interfaces/AuthoredItem.js'
import { hasGroupAccess } from "../utils/accessTokenUtils.js"

interface AuthenticateProps {
    getId: (req: Request) => number | undefined,
    getAuthorInfo: (id: number) => AuthoredItem | undefined,
    requiredGroup?: UserGroup,
    evaluateGroup?: boolean
}

export function requiresAuthor(props: Omit<AuthenticateProps, "requiredGroup" | "evaluateGroup" >) {
    return authenticate({
        ...props,
        evaluateGroup: false
    })
}

export function requiresGroupOrAuthor(props: Omit<AuthenticateProps, "evaluateGroup">) {
    return authenticate({
        ...props,
        evaluateGroup: true
    })
}

function authenticate({
    getId,
    getAuthorInfo,
    requiredGroup,
    evaluateGroup,
}: {
    getId: (req: Request) => number | undefined,
    getAuthorInfo: (id: number) => AuthoredItem | undefined,
    evaluateGroup: boolean
    requiredGroup?: UserGroup,
}) {
    return (req: Request, res: Response, next: NextFunction) => {
        
        // Get the id from the request
        let id: unknown
        try {
            id = getId(req)
        } catch {
            return res.status(400).send("Bad request")
        }
                
        // Check if the id is a valid number
        if (!isValidNumber(id)) {
            return res.status(400).send("Bad request")
        }

        // Get current user
        const user = req.user as AccessTokenData | undefined
        if(user === undefined || !isValidNumber(user?.userId)) {
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
        if(item?.createdBy === undefined) {
            return res.status(404).send("Item not found")
        }

        // Check if the user has the required group privileges
        let hasPrivilege = false
        if(evaluateGroup && requiredGroup !== undefined) { 
            hasPrivilege = hasGroupAccess(user, requiredGroup)
        }

        // Check if the user is the author
        const isAuthor = item.createdBy === user.userId

        if (hasPrivilege || isAuthor) {
            next()
        } else {
            res.status(401).send("Unauthorized")
        }
    }
}

// Checks that the value is a number and greater than or equal to 0
function isValidNumber(value: unknown): value is number {
    return value !== undefined && 
        typeof value === "number" && 
        !isNaN(value) && 
        value >= 0
}