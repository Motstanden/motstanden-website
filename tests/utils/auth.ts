import { APIRequestContext, Browser, Page, Request } from "@playwright/test"
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { User } from "common/interfaces"
import { navClick } from "./navClick.js"

export function getStoragePath(group: UserGroup): string {
    switch(group) {
        case UserGroup.Contributor:         return "storage-state/contributor.json"
        case UserGroup.Editor:              return "storage-state/editor.json"
        case UserGroup.Administrator:       return "storage-state/admin.json"
        case UserGroup.SuperAdministrator:  return "storage-state/superAdmin.json"
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

export function getUser(group: UserGroup): TestUser {
    switch (group) {
        case UserGroup.Contributor: return  {
            id: 301,
            email: "test-contributor-1@motstanden.no",
            groupName: UserGroup.Contributor,
            rank: UserRank.KiloOhm,
            firstName: "__Test User",
            middleName: "",
            lastName: "Contributor",
            profilePicture: "",
            capeName: "",
            status: UserStatus.Active,
            startDate: "2018-09-01",
            endDate: null,
            phoneNumber: null,
            birthDate: null
        }
        case UserGroup.Editor: return {
            id: 321,
            email: "test-editor-1@motstanden.no",
            groupName: UserGroup.Editor,
            rank: UserRank.MegaOhm,
            firstName: "__Test User",
            middleName: "",
            lastName: "Editor",
            profilePicture: "",
            capeName: "",
            status: UserStatus.Active,
            startDate: "2018-09-01",
            endDate: null,
            phoneNumber: null,
            birthDate: null }
        case UserGroup.Administrator: return {
            id: 341,
            email: "test-admin-1@motstanden.no",
            groupName: UserGroup.Administrator,
            rank: UserRank.GigaOhm,
            firstName: "__Test User",
            middleName: "",
            lastName: "Admin",
            profilePicture: "",
            capeName: "",
            status: UserStatus.Active,
            startDate: "2018-09-01",
            endDate: null,
            phoneNumber: null,
            birthDate: null}
        case UserGroup.SuperAdministrator: return {
            id: 361,
            email: "test-superadmin-1@motstanden.no",
            groupName: UserGroup.SuperAdministrator,
            rank: UserRank.HighImpedance,
            firstName: "__Test User",
            middleName: "",
            lastName: "Super Admin",
            profilePicture: "",
            capeName: "",
            status: UserStatus.Active,
            startDate: "2018-09-01",
            endDate: null,
            phoneNumber: null,
            birthDate: null }
    }
}