import { expect } from "@playwright/test"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { NewUser, UpdateUserAsSuperAdminBody, UpdateUserMembershipAsAdminBody, UpdateUserPersonalInfoBody, User } from "common/interfaces"
import { randomInt, randomUUID } from "crypto"
import dayjs from "../../../lib/dayjs.js"

export function assertEqualUsers(actual: User, expected: User) { 
    expect(actual.id).toBe(expected.id)
    expect(actual.firstName).toBe(expected.firstName)
    expect(actual.middleName).toBe(expected.middleName)
    expect(actual.lastName).toBe(expected.lastName)
    expect(actual.email).toBe(expected.email)
    expect(actual.profilePicture).toBe(expected.profilePicture)
    expect(actual.groupName).toBe(expected.groupName)
    expect(actual.rank).toBe(expected.rank)
    expect(actual.capeName).toBe(expected.capeName)
    expect(actual.status).toBe(expected.status)
    expect(actual.phoneNumber).toBe(expected.phoneNumber)
    expect(actual.birthDate).toBe(expected.birthDate)
    expect(actual.startDate).toBe(expected.startDate)
    expect(actual.endDate).toBe(expected.endDate)

    // No need to compare createdAt and updatedAt
}


type UrlType = "POST users" | "users/*/personal-info" | "users/:id/membership" | "users/:id"

export function getRandomPayloadFor(url: "POST users"): NewUser;
export function getRandomPayloadFor(url: "users/*/personal-info"): UpdateUserPersonalInfoBody;
export function getRandomPayloadFor(url: "users/:id/membership"): UpdateUserMembershipAsAdminBody;
export function getRandomPayloadFor(url: "users/:id"): UpdateUserAsSuperAdminBody;
export function getRandomPayloadFor(url: UrlType): NewUser | UpdateUserAsSuperAdminBody | UpdateUserMembershipAsAdminBody | UpdateUserPersonalInfoBody {

    const uuid: string = randomUUID().toLowerCase()

    switch (url) {

        case "POST users":
            return {
                firstName: `___firstName ${uuid}`,
                middleName: `___middleName ${uuid}`,
                lastName: `___lastName ${uuid}`,
                email: `${uuid}@test.motstanden.no`,
                profilePicture: "files/private/profilbilder/girl.png"
            } satisfies NewUser
        
        case "users/*/personal-info": {
            return {
                firstName: `___firstName ${uuid}`,
                middleName: `___middleName ${uuid}`,
                lastName: `___lastName ${uuid}`,
                email: `${uuid}@test.motstanden.no`,
                phoneNumber: randomInt(10000000, 99999999),
                birthDate: dayjs().subtract(20, "years").utc().format("YYYY-MM-DD"),
            } satisfies UpdateUserPersonalInfoBody;
        }
    
        case "users/:id/membership": 
            return {
                rank: UserRank.GigaOhm,
                capeName: `___capeName ${uuid}`,
                status: UserStatus.Retired,
                startDate: dayjs().subtract(6, "years").utc().format("YYYY-MM-DD"),
                endDate: dayjs().subtract(3, "years").utc().format("YYYY-MM-DD"),
            } satisfies UpdateUserMembershipAsAdminBody
    
        case "users/:id":
            return {
                firstName: `___firstName ${uuid}`,
                middleName: `___middleName ${uuid}`,
                lastName: `___lastName ${uuid}`,
                email: `${uuid}@test.motstanden.no`,
                groupName: UserGroup.Editor,
                status: UserStatus.Inactive,
                rank: UserRank.KiloOhm,
                capeName: `___capeName ${uuid}`,
                phoneNumber: randomInt(10000000, 99999999),
                birthDate: dayjs().subtract(25, "years").utc().format("YYYY-MM-DD"),
                startDate: dayjs().subtract(5, "years").utc().format("YYYY-MM-DD"),
                endDate: dayjs().subtract(2, "years").utc().format("YYYY-MM-DD"),
            } satisfies UpdateUserAsSuperAdminBody

        default:
            throw new Error("Not implemented")
    }
}