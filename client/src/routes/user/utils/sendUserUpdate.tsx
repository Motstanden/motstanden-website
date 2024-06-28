import { UserGroup } from "common/enums"
import { UpdateUserAsSelfBody, UpdateUserAsSuperAdminBody, UpdateUserMembershipBody, UpdateUserRoleBody, User } from "common/interfaces"
import { patchJson, putJson } from "src/utils/postJson"
import { UserEditMode } from "./UserEditMode"

type ConclusiveUserUpdateResult = {
    success: boolean,
    partialSuccess: true
}

type UnclearUserUpdateResult = { 
    success: boolean,
    partialSuccess: boolean
}

type UserUpdateResult = ConclusiveUserUpdateResult | UnclearUserUpdateResult

export async function sendUserUpdate(mode: UserEditMode, userId: number, newData: User): Promise<UserUpdateResult> {
    switch (mode) {
        case UserEditMode.Self:
            return {
                success: await updateAsSelf(newData),
                partialSuccess: false
            }
        case UserEditMode.SelfAndAdmin:
            return await updateAsSelfAndAdmin(userId, newData)
        case UserEditMode.Admin:
            return await updateAsAdmin(userId, newData)
        case UserEditMode.SuperAdmin:
            return {
                success: await updateAsSuperAdmin(userId, newData),
                partialSuccess: true
            }
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

async function updateAsAdmin(userId: number, newData: User): Promise<UnclearUserUpdateResult> {
    const body: UpdateUserMembershipBody = {
        rank: newData.rank,
        capeName: newData.capeName,
        status: newData.status,
        startDate: newData.startDate,
        endDate: newData.endDate
    }
    const res = await putJson(`/api/users/${userId}/membership`, body)

    const partialSuccess = res?.ok ?? false

    const success = partialSuccess 
        ? await sendUpdateRole(userId, newData.groupName) 
        : false

    return { success, partialSuccess }
}

async function updateAsSelfAndAdmin(userId: number, newData: User): Promise<UnclearUserUpdateResult> {

    const partialSuccess = await updateAsSelf(newData)

    const success = partialSuccess 
        ? (await updateAsAdmin(userId, newData)).success 
        : false
    
    return { success, partialSuccess }
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
