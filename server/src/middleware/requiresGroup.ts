import { UserGroup } from "common/enums"
import { userGroupToNum } from "common/utils"
import { NextFunction, Request, Response } from 'express'
import { getUser } from "../utils/getUser.js"

export function RequiresGroup(requiredGroup: UserGroup) {
    return (req: Request, res: Response, next: NextFunction) => {
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
}