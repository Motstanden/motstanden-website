import { UserGroup } from "common/enums"
import { UpdateUserAsSelfBody, UpdateUserAsSuperAdminBody, UpdateUserMembershipBody, UpdateUserRoleBody, User } from "common/interfaces"
import { patchJson, putJson } from "src/utils/postJson"
import { UserEditMode } from "./UserEditMode"

type UserUpdateResult = { 
    success: boolean,
    partialSuccess: boolean
}

type UpdateAsAdminOpts = {
    updateTargeIsSuperAdmin: boolean
}

export async function sendUserUpdate(mode: UserEditMode, userId: number, newData: User, opts?: UpdateAsAdminOpts): Promise<UserUpdateResult> {
    const updateTargeIsSuperAdmin = opts?.updateTargeIsSuperAdmin ?? false
    switch (mode) {
        case UserEditMode.Self: {
            const success = await updateAsSelf(newData)
            return { success, partialSuccess: success }
        }
        case UserEditMode.SelfAndAdmin: {
            return await updateAsSelfAndAdmin(userId, newData, { updateTargeIsSuperAdmin })
        }
        case UserEditMode.Admin: {
            return await updateAsAdmin(userId, newData, { updateTargeIsSuperAdmin })
        }
        case UserEditMode.SuperAdmin: {
            const success = await updateAsSuperAdmin(userId, newData)
            return { success: success, partialSuccess: success }
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
    const res = await patchJson("/api/users/me", body, { alertOnFailure: true })
    return res?.ok ?? false
}

async function updateAsAdmin(userId: number, newData: User, { updateTargeIsSuperAdmin }: UpdateAsAdminOpts): Promise<UserUpdateResult> {

    // It is important to update the membership first because are allowed to demote themselves,
    // which will cause this request to fail
    const body: UpdateUserMembershipBody = {
        rank: newData.rank,
        capeName: newData.capeName,
        status: newData.status,
        startDate: newData.startDate,
        endDate: newData.endDate
    }
    const res = await putJson(`/api/users/${userId}/membership`, body, { alertOnFailure: true })

    const partialSuccess = res?.ok ?? false

    // If the target user is a super admin, we can't update their role
    if(updateTargeIsSuperAdmin)
        return { success: partialSuccess, partialSuccess: partialSuccess }
    
    const success = partialSuccess 
        ? await sendUpdateRole(userId, newData.groupName)
        : false

    return { success, partialSuccess }
}

async function updateAsSelfAndAdmin(userId: number, newData: User, { updateTargeIsSuperAdmin }: UpdateAsAdminOpts): Promise<UserUpdateResult> {

    const partialSuccess = await updateAsSelf(newData)

    const success = partialSuccess 
        ? (await updateAsAdmin(userId, newData, { updateTargeIsSuperAdmin })).success 
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
    const res = await patchJson(`/api/users/${userId}`, body, { alertOnFailure: true })
    return res?.ok ?? false
}

async function sendUpdateRole(userId: number, role: UserGroup): Promise<boolean> {
    const body: UpdateUserRoleBody = { groupName: role }
    const res = await putJson(`/api/users/${userId}/role`, body, { alertOnFailure: true })
    return res?.ok ?? false
}
