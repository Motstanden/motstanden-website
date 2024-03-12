import { APIRequestContext, Browser, Page, TestInfo } from "@playwright/test";
import { UserGroup, UserRank, UserStatus } from "common/enums";
import { User } from "common/interfaces";

export interface TestUser extends Omit<User, "groupId" | "createdAt" | "updatedAt"> { 
    storageStatePath: string
}


export async function apiLogIn(apiContext: APIRequestContext, user: TestUser): Promise<void>;
export async function apiLogIn(apiContext: APIRequestContext, info: TestInfo, group?: UserGroup): Promise<void>;
export async function apiLogIn(apiContext: APIRequestContext, userOrInfo: TestUser | TestInfo, group?: UserGroup): Promise<void> {

    const isUser = (user: any): user is TestUser => {
        return user && typeof user === 'object' && 'email' in user
    }

    if (isUser(userOrInfo)) {
        await unsafeApiLogIn(apiContext, userOrInfo.email);
    } else {
        const user = getUser(userOrInfo, group ?? UserGroup.Contributor);
        await unsafeApiLogIn(apiContext, user.email);
    }
}

export async function unsafeApiLogIn(apiContext: APIRequestContext, email: string): Promise<void> {
    const res = await apiContext.post("/api/dev/auth/login", { data: { destination: email } })
    if(!res.ok()) 
        throw `Failed to authenticate user: ${email}`
}

export async function logIn(browser: Browser, workerInfo: TestInfo, group: UserGroup) {
    const user = getUser(workerInfo, group)
    const page = await storageLogIn(browser, user)
    return {
        page: page,
        user: user
    }
}

export async function disposeLogIn(page: Page) {
    await page.context().close()
}

export async function storageLogIn(browser: Browser, user: TestUser): Promise<Page> {
    const context = await browser.newContext({ storageState: user.storageStatePath}) 
    const page = await context.newPage()
    return page
}


export async function disposeStorageLogIn(page: Page) {
    await page.context().close()
}

// Must match the test user data in database/data/db/InsertUsers.sql
// If you change this, make sure to also update the test user data in the database
const contributorStartId = 300
const editorStartId = 320
const adminStartId = 340
const superAdminStartId = 360
export const testUserVariationsCount = 20

export function getUser(workerInfo: TestInfo, group: UserGroup): TestUser {
    return unsafeGetUser(group, workerInfo.parallelIndex);
}

export function unsafeGetUser(group: UserGroup, variantIndex: number): TestUser {

    if(variantIndex < 0 || variantIndex >= testUserVariationsCount) 
        throw `Variant id out of range. Max variant id is ${testUserVariationsCount}`

    const variantId = variantIndex + 1;

    // Must match the test user data in database/data/db/InsertUsers.sql
    // If you change this, make sure to also update the test user data in the database
    switch (group) {
        case UserGroup.Contributor: 
            return  {
                storageStatePath: `storage-state/contributor-${variantId}.json`,

                id: contributorStartId + variantId,
                email: `test-contributor-${variantId}@motstanden.no`,
                groupName: UserGroup.Contributor,
                rank: UserRank.KiloOhm,
                firstName: "__Test User",
                middleName: "",
                lastName: `Contributor ${variantId}`,
                profilePicture: "",
                capeName: "",
                status: UserStatus.Active,
                startDate: "2018-09-01",
                endDate: null,
                phoneNumber: null,
                birthDate: null
            }
        case UserGroup.Editor: 
            return {
                storageStatePath: `storage-state/editor-${variantId}.json`,

                id: editorStartId + variantId,
                email: `test-editor-${variantId}@motstanden.no`,
                groupName: UserGroup.Editor,
                rank: UserRank.MegaOhm,
                firstName: "__Test User",
                middleName: "",
                lastName: `Editor ${variantId}`,
                profilePicture: "",
                capeName: "",
                status: UserStatus.Active,
                startDate: "2018-09-01",
                endDate: null,
                phoneNumber: null,
                birthDate: null 
            }
        case UserGroup.Administrator: 
            return {
                storageStatePath: `storage-state/admin-${variantId}.json`,

                id: adminStartId + variantId,
                email: `test-admin-${variantId}@motstanden.no`,
                groupName: UserGroup.Administrator,
                rank: UserRank.GigaOhm,
                firstName: "__Test User",
                middleName: "",
                lastName: `Admin ${variantId}`,
                profilePicture: "",
                capeName: "",
                status: UserStatus.Active,
                startDate: "2018-09-01",
                endDate: null,
                phoneNumber: null,
                birthDate: null
            }
        case UserGroup.SuperAdministrator: 
            return {
                storageStatePath: `storage-state/superAdmin-${variantId}.json`,

                id: superAdminStartId + variantId,
                email: `test-superadmin-${variantId}@motstanden.no`,
                groupName: UserGroup.SuperAdministrator,
                rank: UserRank.HighImpedance,
                firstName: "__Test User",
                middleName: "",
                lastName: `Super Admin ${variantId}`,
                profilePicture: "",
                capeName: "",
                status: UserStatus.Active,
                startDate: "2018-09-01",
                endDate: null,
                phoneNumber: null,
                birthDate: null 
            }
    }
}