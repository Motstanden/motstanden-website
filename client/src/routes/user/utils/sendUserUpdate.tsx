import { UserGroup } from "common/enums"
import { UpdateUserAsSelfBody, UpdateUserAsSuperAdminBody, UpdateUserMembershipBody, UpdateUserRoleBody, User } from "common/interfaces"
import { patchJson, putJson } from "src/utils/postJson"
import { UserEditMode } from "./UserEditMode"

export async function sendUserUpdate(mode: UserEditMode, userId: number, newData: User): Promise<boolean> {
    switch (mode) {
        case UserEditMode.Self:
            return await updateAsSelf(newData)
        case UserEditMode.SelfAndAdmin:
            return await updateAsSelfAndAdmin(userId, newData)
        case UserEditMode.Admin:
            return await updateAsAdmin(userId, newData)
        case UserEditMode.SuperAdmin:
            return await updateAsSuperAdmin(userId, newData)
    }
}

async function updateAsSelf(newData: User): Promise<boolean> {
    const body: UpdateUserAsSelfBody = {
        firstName: newData.firstName,
        middleName: newData.middleName,
        lastName: newData.lastName,
        email: newData.email,
        phoneNumber: newData.phoneNumber,
        capeName: newData.capeName,
        status: newData.status,
        birthDate: newData.birthDate,
        startDate: newData.startDate,
        endDate: newData.endDate
    }
    const res = await patchJson("/api/users/me", body)
    return res?.ok ?? false
}

async function updateAsAdmin(userId: number, newData: User): Promise<boolean> {
    const body: UpdateUserMembershipBody = {
        rank: newData.rank,
        capeName: newData.capeName,
        status: newData.status,
        startDate: newData.startDate,
        endDate: newData.endDate
    }
    const res = await putJson(`/api/users/${userId}/membership`, body)

    if (!res?.ok)
        return false

    return await sendUpdateRole(userId, newData.groupName)
}

async function updateAsSelfAndAdmin(userId: number, newData: User): Promise<boolean> {
    return await updateAsSelf(newData)
        && await updateAsAdmin(userId, newData)
}

async function updateAsSuperAdmin(userId: number, newData: User): Promise<boolean> {
    const body: UpdateUserAsSuperAdminBody = {
        firstName: newData.firstName,
        middleName: newData.middleName,
        lastName: newData.lastName,
        email: newData.email,
        groupName: newData.groupName,
        rank: newData.rank,
        capeName: newData.capeName,
        status: newData.status,
        phoneNumber: newData.phoneNumber,
        birthDate: newData.birthDate,
        startDate: newData.startDate,
        endDate: newData.endDate
    }
    const res = await patchJson(`/api/users/${userId}`, body)

    return res?.ok ?? false
}

async function sendUpdateRole(userId: number, role: UserGroup): Promise<boolean> {
    const body: UpdateUserRoleBody = { groupName: role }
    const res = await putJson(`/api/users/${userId}/role`, body)
    return res?.ok ?? false
}
