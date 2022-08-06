import { User } from "@backend/interfaces/User";

export function getFullName(user: User): string {
    let fullName = user.firstName
    if(user.middleName)
        fullName += " " + user.middleName

    if(user.lastName)
        fullName += " " + user.lastName

    return fullName
}