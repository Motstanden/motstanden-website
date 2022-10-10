import { UserGroup, UserRank, UserStatus } from "../enums/index";
import { User } from "../interfaces/index";

export function userGroupToNum(group: UserGroup): number {
    switch (group) {
        case UserGroup.Contributor: return 1
        case UserGroup.Editor: return 2
        case UserGroup.Administrator: return 3
        case UserGroup.SuperAdministrator: return 4
        default: throw "Invalid case"
    }
}

export function hasGroupAccess(user: User, requiredGroup: UserGroup): boolean {
    return userGroupToNum(user.groupName) >= userGroupToNum(requiredGroup)
}

export function getFullName(user: User): string {
    let fullName = user.firstName
    if (user.middleName)
        fullName += " " + user.middleName

    if (user.lastName)
        fullName += " " + user.lastName

    return fullName
}

export function userRankToPrettyStr(rank: UserRank): string {
    switch (rank) {
        case UserRank.ShortCircuit: return "0Ω"
        case UserRank.Ohm: return "1Ω"
        case UserRank.KiloOhm: return "kΩ"
        case UserRank.MegaOhm: return "MΩ"
        case UserRank.GigaOhm: return "GΩ"
        case UserRank.HighImpedance: return "Høyimpedant"
        default: return "Ukjent"
    }
}

export function userGroupToPrettyStr(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "-"
        case UserGroup.Editor: return "Redaktør"
        case UserGroup.Administrator: return "Admin"
        case UserGroup.SuperAdministrator: return "Super admin"
        default: return "Ukjent"
    }
}

export function userStatusToPrettyStr(status: UserStatus) {
    return status.toString()
}