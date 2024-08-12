import Playwright, { APIRequestContext, TestInfo } from '@playwright/test'
import { UserGroup } from "common/enums"
import { NewUser, UpdateUserRoleBody, User } from "common/interfaces"
import { randomUUID } from 'crypto'
import { getUser as getTestUser } from '../../utils/auth.js'


async function getUser(request: APIRequestContext, id: number): Promise<User> {
    const res = await request.get(`/api/users/${id}`)
    if(!res.ok()) {
        throw new Error(`Failed to get user ${id}.\n${res.status()}: ${res.statusText()}`)
    }
    const user = await res.json() as User
    return user
}

async function getAllUsers(request: APIRequestContext) {
    const res = await request.get("/api/users")
    if(!res.ok()) {
        throw new Error(`Failed to get all users.\n${res.status()}: ${res.statusText()}`)
    }
    const users = await res.json() as User[]
    return users   
}

async function createUser(request: APIRequestContext, newUser: NewUser) {
    const res = await request.post("/api/users", { data: newUser })
    if(!res.ok()) {
        throw new Error(`Failed to create user.\n${res.status()}: ${await res.text()}`)
    }

    const resultData = await res.json()
    const id = resultData?.userId

    if(id === undefined || typeof id !== "number" || id <= 0 || isNaN(id)) { 
        throw new Error(`Expected to get a valid user id, but got: ${id}.`)
    }

    return id
}

async function deleteUser(workerInfo: TestInfo, id: number) {

    // Log in as super admin
    const superAdmin = getTestUser(workerInfo, UserGroup.SuperAdministrator)
    const request = await Playwright.request.newContext( { storageState: superAdmin.storageStatePath } )

    // Delete user
    const res = await request.delete(`/api/users/${id}`)
    if(!res.ok()) {
        throw new Error(`Failed to delete user ${id}.\n${res.status()}: ${res.statusText()}`)
    }

    await request.dispose()
}

async function deleteCurrentUser(request: APIRequestContext) {
    const res = await request.delete(`/api/users/me`)
    if(!res.ok()) {
        throw new Error(`Failed to delete current user.\n${res.status()}: ${res.statusText()}`)
    }
}

async function createRandomUser(workerInfo: TestInfo, group: UserGroup = UserGroup.Contributor): Promise<User> {

    // Log in as super admin
    const superAdmin = getTestUser(workerInfo, UserGroup.SuperAdministrator)
    const request = await Playwright.request.newContext( { storageState: superAdmin.storageStatePath } )

    // Create and post random user
    const newUser: NewUser = {
        firstName: `__firstName ${randomUUID().toLowerCase()}`,
        middleName: `__middleName ${randomUUID().toLowerCase()}`,
        lastName: `__lastName ${randomUUID().toLowerCase()}`,
        email: `${randomUUID().toLowerCase()}@motstanden.no`,
        profilePicture: "files/private/profilbilder/girl.png"
    }
    const id = await createUser(request, newUser)

    // Update role if not default value
    if(group !== UserGroup.Contributor) { 
        await updateRole(request, id, group)
    }

    // Fetch and return the actual data from server
    const user = await getUser(request, id)
    await request.dispose()
    return user
}

async function updateRole(request: APIRequestContext, userId: number, newGroup: UserGroup) { 
    const body: UpdateUserRoleBody = { groupName: newGroup }
    const res = await request.put(`/api/users/${userId}/role`, { data: body })
    if(!res.ok()) {
        throw new Error(`Failed to create user.\n${res.status()}: ${await res.text()}`)
    }
}

export const usersApi = {
    get: getUser,
    getAll: getAllUsers,
    create: createUser,
    createRandom: createRandomUser,
    delete: deleteUser,
    deleteCurrentUser: deleteCurrentUser,
}
