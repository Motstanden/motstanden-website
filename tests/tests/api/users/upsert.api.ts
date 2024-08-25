import Playwright, { APIRequestContext, APIResponse, TestInfo, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { NewUser, UpdateUserAsSuperAdminBody, UpdateUserMembershipAsAdminBody, UpdateUserPersonalInfoBody, UpdateUserRoleBody, User } from 'common/interfaces'
import { randomInt, randomUUID } from 'crypto'
import dayjs from "../../../lib/dayjs.js"
import { api } from '../../../utils/api/index.js'
import { apiLogIn, getUser as getTestUser, unsafeApiLogIn } from '../../../utils/auth.js'
import { assertEqualUsers } from './utils.js'


test("POST /api/users", async ({request}, workerInfo) => { 
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)

    const uuid: string = randomUUID().toLowerCase()
    const newUser: NewUser = {
        firstName: "__Test_1",
        middleName: "User_1",
        lastName: uuid,
        email: `${uuid}@motstanden.no`,
        profilePicture: "files/private/profilbilder/girl.png"
    }

    const id = await api.users.create(request, newUser)
    const actualUser = await api.users.get(request, id)

    const expectedUser: User = { 
        ...newUser,
        id: id,
        groupId: 1,
        groupName: UserGroup.Contributor,
        rank: UserRank.ShortCircuit,
        capeName: "",
        status: UserStatus.Active,
        phoneNumber: null,
        birthDate: null,
        startDate: dayjs().utc().format("YYYY-MM-DD"),
        endDate: null,  
        
        // createdAt and updatedAt are not known in advance
        createdAt: actualUser.createdAt,
        updatedAt: actualUser.updatedAt,
    }

    assertEqualUsers(actualUser, expectedUser)

    await api.users.delete(workerInfo, id)
})

test("PATCH /api/users/me/personal-info", async ({request}, workerInfo) => { 

    const user = await api.users.createRandom(workerInfo)

    // Log in as the new user
    await unsafeApiLogIn(request, user.email)

    // Post new random user data
    const uuid: string = randomUUID().toLowerCase()
    const newUserData: UpdateUserPersonalInfoBody = {
        firstName: `___firstName ${uuid}`,
        middleName: `___middleName ${uuid}`,
        lastName: `___lastName ${uuid}`,
        email: `${uuid}@motstanden.no`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: dayjs().subtract(20, "years").utc().format("YYYY-MM-DD"),
    }
    await updateUser(request, { type: "my-personal-info", data: newUserData })

    const actualUser = await api.users.get(request, user.id)
    const expectedUser: User = { ...user, ...newUserData,}

    assertEqualUsers(actualUser, expectedUser)

    await api.users.delete(workerInfo, actualUser.id)
})

test("PATCH /api/users/:id", async ({request}, workerInfo) => { 
    const user = await api.users.createRandom(workerInfo)
    await apiLogIn(request, workerInfo, UserGroup.SuperAdministrator)
    
    const uuid: string = randomUUID().toLowerCase()
    const newUserData: UpdateUserAsSuperAdminBody = {
        firstName: `___firstName ${uuid}`,
        middleName: `___middleName ${uuid}`,
        lastName: `___lastName ${uuid}`,
        email: `${uuid}@motstanden.no`,
        groupName: UserGroup.Editor,
        status: UserStatus.Inactive,
        rank: UserRank.KiloOhm,
        capeName: `___capeName ${uuid}`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: dayjs().subtract(25, "years").utc().format("YYYY-MM-DD"),
        startDate: dayjs().subtract(5, "years").utc().format("YYYY-MM-DD"),
        endDate: dayjs().subtract(2, "years").utc().format("YYYY-MM-DD"),
    } 
    await updateUser(request, { type: "superadmin", data: newUserData, id: user.id })

    const actualUser = await api.users.get(request, user.id)
    const expectedUser: User = { ...user, ...newUserData,}

    assertEqualUsers(actualUser, expectedUser)

    // Clean up: Delete the user that was created
    await api.users.delete(workerInfo, actualUser.id)
})


test("PUT /api/users/:id/membership", async ({request}, workerInfo) => { 
    const user = await api.users.createRandom(workerInfo)
    await apiLogIn(request, workerInfo, UserGroup.Administrator)

    const uuid: string = randomUUID().toLowerCase()
    const newUserData: UpdateUserMembershipAsAdminBody = { 
        rank: UserRank.GigaOhm,
        capeName: `___capeName ${uuid}`,
        status: UserStatus.Retired,
        startDate: dayjs().subtract(6, "years").utc().format("YYYY-MM-DD"),
        endDate: dayjs().subtract(3, "years").utc().format("YYYY-MM-DD"),
    }
    await updateUser(request, { type: "membership", data: newUserData, id: user.id })

    const actualUser = await api.users.get(request, user.id)
    const expectedUser: User = { ...user, ...newUserData,}

    assertEqualUsers(actualUser, expectedUser)
})

test.describe("PUT /api/users/:id/role", () => { 

    testCanUpdateRole({
        title: "Admin can promote to admin",
        currentUserRole: UserGroup.Administrator,
        targetNewRole: UserGroup.Administrator
    })

    testCanUpdateRole({
        title: "Super admin can promote to super admin",
        currentUserRole: UserGroup.SuperAdministrator, 
        targetNewRole: UserGroup.SuperAdministrator
    })

    testCanUpdateRole({
        title: "Super admin can demote super admin",
        currentUserRole: UserGroup.SuperAdministrator,
        targetNewRole: UserGroup.Contributor
    })

    testCanNotUpdateRole({
        title: "Admin can not promote to super admin",
        currentUserRole: UserGroup.Administrator,
        targetInitialRole: UserGroup.Contributor,
        targetNewRole: UserGroup.SuperAdministrator
    })

    testCanNotUpdateRole({
        title: "Admin can not demote super admin",
        currentUserRole: UserGroup.Administrator,
        targetInitialRole: UserGroup.SuperAdministrator,
        targetNewRole: UserGroup.Contributor
    })

    async function testCanUpdateRole({
        title, currentUserRole, targetNewRole
    }: {
        title: string,
        currentUserRole: UserGroup,
        targetNewRole: UserGroup
    }) { 
    
        test(title, async ({request}, workerInfo) => {
            
            // Create new user
            const user = await api.users.createRandom(workerInfo)
            expect(user.groupName).toBe(UserGroup.Contributor)
    
            // Log in with the permissions of current user
            await apiLogIn(request, workerInfo, currentUserRole)
    
            const res = await updateRole(request, user, targetNewRole)
            expect(res.ok(), `Failed to update role\n${res.status()}: ${res.statusText()}`).toBeTruthy()
    
            const updatedUser = await api.users.get(request, user.id)
            expect(updatedUser.groupName).toBe(targetNewRole)

            // Clean up: Delete the user that was created
            await api.users.delete(workerInfo, updatedUser.id)
        })
    }
    
    async function testCanNotUpdateRole({
        title, currentUserRole, targetInitialRole, targetNewRole
    }: {
        title: string,
        currentUserRole: UserGroup,
        targetInitialRole: UserGroup,
        targetNewRole: UserGroup
    }) { 
    
        const updateRoleAsSuperAdmin = async (workerInfo: TestInfo, user: User, newGroup: UserGroup) => { 
            const superAdmin = getTestUser(workerInfo, UserGroup.SuperAdministrator)
            const request = await Playwright.request.newContext( { storageState: superAdmin.storageStatePath } )
            await updateRole(request, user, newGroup)
            await request.dispose()
        }
    
        test(title, async ({request}, workerInfo) => { 
    
            // Create new user
            const user = await api.users.createRandom(workerInfo)
            expect(user.groupName).toBe(UserGroup.Contributor)
    
            // Force user to have the initial role
            await updateRoleAsSuperAdmin(workerInfo, user, targetInitialRole)
    
            // Log in with the permissions of current user
            await apiLogIn(request, workerInfo, currentUserRole)
    
            // Assert that the user has the initial role
            const user2 = await api.users.get(request, user.id)
            expect(user2.groupName).toBe(targetInitialRole)
    
            // Try to update role
            const res = await updateRole(request, user, targetNewRole)
            expect(res.status(), `Expected 403 forbidden but got ${res.status()} ${res.statusText()}`).toBe(403)
    
            // Assert role has not changed
            const user3 = await api.users.get(request, user.id)
            expect(user3.groupName).toBe(targetInitialRole)

            // Clean up: Delete the user that was created
            await api.users.delete(workerInfo, user.id)
        })
    }
    
    async function updateRole(request: APIRequestContext, user: User, newGroup: UserGroup) { 
        const body: UpdateUserRoleBody = {
            groupName: newGroup
        }
        const res = await request.put(`/api/users/${user.id}/role`, { data: body })
        return res
    }
})

type UpdateType = {
    type: "my-personal-info",
    data: UpdateUserPersonalInfoBody
    id?: never
} | {
    type: "membership",
    data: UpdateUserMembershipAsAdminBody
    id: number
} | {
    type: "superadmin",
    data: UpdateUserAsSuperAdminBody
    id: number
}

async function updateUser(request: APIRequestContext,  {type, data, id} : UpdateType)  {
    let res: APIResponse 
    switch(type) { 
        case "my-personal-info":
            res = await request.put("/api/users/me/personal-info", { data: data })
            break
        case "membership":
            res = await request.put(`/api/users/${id}/membership`, { data: data })
            break
        case "superadmin":
            res = await request.patch(`/api/users/${id}`, { data: data })
            break
    }
    if(!res.ok()) {
        throw new Error(`Failed to update user.\n${res.status()}: ${await res.text()}`)
    }
}