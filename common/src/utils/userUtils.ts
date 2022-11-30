import { 
    UserGroup, 
    UserRank,
    UserStatus 
} from "../enums/index.js"
import { User } from "../interfaces/index.js"

export function userGroupToNum(group: UserGroup): number {
    switch (group) {
        case UserGroup.Contributor: return 1
        case UserGroup.Editor: return 2
        case UserGroup.Administrator: return 3
        case UserGroup.SuperAdministrator: return 4
        default: throw "Invalid case.js"
    }
}

export function hasGroupAccess(user: User, requiredGroup: UserGroup): boolean {
    return userGroupToNum(user.groupName) >= userGroupToNum(requiredGroup)
}

export function getFullName(user: Pick<User, "firstName" | "middleName" | "lastName">): string {
    let fullName = user.firstName
    if (user.middleName)
        fullName += " " + user.middleName

    if (user.lastName)
        fullName += " " + user.lastName

    return fullName
}

export function userRankToPrettyStr(rank: UserRank): string {
    switch (rank) {
        case UserRank.ShortCircuit: return "0Ω.js"
        case UserRank.Ohm: return "1Ω.js"
        case UserRank.KiloOhm: return "kΩ.js"
        case UserRank.MegaOhm: return "MΩ.js"
        case UserRank.GigaOhm: return "GΩ.js"
        case UserRank.HighImpedance: return "Høyimpedant.js"
        default: return "Ukjent.js"
    }
}

export function userGroupToPrettyStr(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "-.js"
        case UserGroup.Editor: return "Redaktør.js"
        case UserGroup.Administrator: return "Admin.js"
        case UserGroup.SuperAdministrator: return "Super admin.js"
        default: return "Ukjent.js"
    }
}

export function userStatusToPrettyStr(status: UserStatus) {
    return status.toString()
}