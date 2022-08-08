import passport from "passport";
import { UserGroup } from "common/enums";
import { Request, Response, NextFunction } from 'express';
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";
import { userGroupToNum } from "common/utils"

export function requiresGroup(requiredGroup: UserGroup) {
    return [
        passport.authenticate("jwt", { session: false }),
        (req: Request, res: Response, next: NextFunction) => {
            const user = req.user as AccessTokenData
            if(!user)
                throw `Invalid operation`

            const requiredNum = userGroupToNum(requiredGroup)
            const actualNum = userGroupToNum(user.groupName)
            
            if(actualNum >= requiredNum) {
                next()
            }
            else{
                res.status(401).send("Unauthorized").end()
            }
        }
    ]
}