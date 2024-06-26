import { UserGroup } from "common/enums"
import { userGroupToNum } from "common/utils"
import { NextFunction, Request, Response } from 'express'
import { getUser } from "../utils/getUser.js"
import { AuthenticateUser } from "./jwtAuthenticate.js"

export function requiresGroup(requiredGroup: UserGroup) {
    return [
        AuthenticateUser(),
        (req: Request, res: Response, next: NextFunction) => {
            const user = getUser(req)

            const requiredNum = userGroupToNum(requiredGroup)
            const actualNum = userGroupToNum(user.groupName)

            if (actualNum >= requiredNum) {
                next()
            }
            else {
                res.status(401).send("Unauthorized").end()
            }
        }
    ]
}