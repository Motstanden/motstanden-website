import { User } from "../interfaces/index";
import { UserGroup } from "../enums/index";

export function userGroupToNum(group: UserGroup): number {
    switch(group) {
        case UserGroup.Contributor: return 1
        case UserGroup.Administrator: return 2
        case UserGroup.SuperAdministrator: return 3
        default: throw "Invalid case"
    }
}

export function hasGroupAccess(user: User, requiredGroup: UserGroup): boolean {
    return userGroupToNum(user.groupName) >= userGroupToNum(requiredGroup)
}

export function getFullName(user: User): string {
    let fullName = user.firstName
    if(user.middleName)
        fullName += " " + user.middleName

    if(user.lastName)
        fullName += " " + user.lastName

    return fullName
}
