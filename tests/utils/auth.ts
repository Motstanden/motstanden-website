import { APIRequestContext, Browser, Page, Request } from "@playwright/test"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { User } from "common/interfaces"
import { navClick } from "./navClick.js"

export function getStoragePath(group: UserGroup, variantIndex: number = 0): string {
    
    if(variantIndex < 0 || variantIndex >= testUserVariationsCount) 
        throw `Variant id out of range. Max variant id is ${testUserVariationsCount}`

    const variantId = variantIndex + 1;

    switch(group) {
        case UserGroup.Contributor:         return `storage-state/contributor-${variantId}.json`
        case UserGroup.Editor:              return `storage-state/editor-${variantId}.json`
        case UserGroup.Administrator:       return `storage-state/admin-${variantId}.json`
        case UserGroup.SuperAdministrator:  return `storage-state/superAdmin-${variantId}.json`
        default: 
            throw `No storage state for group "${group}"`
    }
}

export async function logIn(page: Page, group: UserGroup) {
    const user = getUser(group)
    await emailLogIn(page, user.email)
}

export async function emailLogIn(page: Page, email: string) {
    if(!page.url().endsWith("/logg-inn")) {
        await page.goto(`${process.env.BASEURL}/logg-inn`);
    }
    await page.getByLabel('E-post *').fill(email);
    await navClick(page.getByRole('button', { name: 'Dev logg inn' }))
}

export async function apiLogIn(apiContext: APIRequestContext, email: string) {
    const res = await apiContext.post("/api/dev/login", { data: { destination: email } })
    if(!res.ok()) 
        throw `Failed to authenticate user: ${email}`
}

export async function storageLogIn(browser: Browser, group: UserGroup) {
    const context = await browser.newContext({ storageState: getStoragePath(group)}) 
    const page = await context.newPage()
    return page
}

export async function disposeStorageLogIn(page: Page) {
    await page.context().close()
}

interface TestUser extends Omit<User, "groupId" | "createdAt" | "updatedAt"> { }


// Must match the test user data in database/data/db/InsertUsers.sql
// If you change this, make sure to also update the test user data in the database
const contributorStartId = 300
const editorStartId = 320
const adminStartId = 340
const superAdminStartId = 360
export const testUserVariationsCount = 20

export function getUser(group: UserGroup, variantIndex: number = 0): TestUser {

    if(variantIndex < 0 || variantIndex >= testUserVariationsCount) 
        throw `Variant id out of range. Max variant id is ${testUserVariationsCount}`

    const variantId = variantIndex + 1;

    // Must match the test user data in database/data/db/InsertUsers.sql
    // If you change this, make sure to also update the test user data in the database
    switch (group) {
        case UserGroup.Contributor: return  {
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
        case UserGroup.Editor: return {
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
            birthDate: null }
        case UserGroup.Administrator: return {
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
            birthDate: null}
        case UserGroup.SuperAdministrator: return {
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
            birthDate: null }
    }
}