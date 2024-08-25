import { expect } from "@playwright/test"
import { User } from "common/interfaces"

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
