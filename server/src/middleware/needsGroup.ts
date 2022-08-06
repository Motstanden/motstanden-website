import passport from "passport";
import { UserGroup } from "../ts/enums/UserGroup";
import { Request, Response, NextFunction } from 'express';
import { AccessTokenData } from "../ts/interfaces/AccessTokenData";

export function needsGroup(requiredGroup: UserGroup){
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
                res.send(401, 'Unauthorized')
            }
        }
    ]
}


function userGroupToNum(group: UserGroup): number {
    switch(group) {
        case UserGroup.Contributor: return 1
        case UserGroup.Administrator: return 2
        case UserGroup.SuperAdministrator: return 3
        default: throw "Invalid case"
    }
}