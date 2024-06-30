import Playwright, { APIRequestContext, TestInfo } from '@playwright/test'
import { UserGroup } from "common/enums"
import { NewUser, User } from "common/interfaces"
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

async function createRandomUser(workerInfo: TestInfo): Promise<User> {

    // Log in as super admin
    const superAdmin = getTestUser(workerInfo, UserGroup.SuperAdministrator)
    const request = await Playwright.request.newContext( { storageState: superAdmin.storageStatePath } )

    // Create and post random user
    const uuid: string = randomUUID().toLowerCase()
    const newUser: NewUser = {
        firstName: `__firstName ${uuid}`,
        middleName: `__middleName ${uuid}`,
        lastName: `__lastName ${uuid}`,
        email: `${uuid}@motstanden.no`,
        profilePicture: "files/private/profilbilder/girl.png"
    }
    
    const id = await createUser(request, newUser)
    const user = await getUser(request, id)
    
    request.dispose()
    
    return user
}


export const usersApi = {
    get: getUser,
    create: createUser,
    createRandom: createRandomUser
}
