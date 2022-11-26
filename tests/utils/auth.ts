import { Browser, expect, Page } from "@playwright/test"
import { UserGroup } from "common/enums"
import { navClick } from "./navClick"

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
    const email = getUserEmail(group)
    await emailLogIn(page, email)
}

export async function emailLogIn(page: Page, email: string) {
    await page.goto(`${process.env.BASEURL}/logg-inn`);
    
    await page.getByLabel('E-post *').fill(email);

    await navClick(page.getByRole('button', { name: 'Dev logg inn' }))
    
    await expect(page).toHaveURL(`${process.env.BASEURL}/hjem`);
}

export function getUserEmail(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "test-contributor@motstanden.no"
        case UserGroup.Editor: return "test-editor@motstanden.no"
        case UserGroup.Administrator: return "test-admin@motstanden.no"
        case UserGroup.SuperAdministrator: return "test-superadmin@motstanden.no"
    }
}

export function getUserFullName(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "__Test User Contributor"
        case UserGroup.Editor: return "__Test User Editor"
        case UserGroup.Administrator: return "__Test User Admin"
        case UserGroup.SuperAdministrator: return "__Test User Super Admin"
    }
}

export async function storageLogIn(browser: Browser, group: UserGroup) {
    const context = await browser.newContext({ storageState: getStoragePath(group)}) 
    const page = await context.newPage()
    return page
}

export async function disposeStorageLogIn(page: Page) {
    await page.context().close()
}