import { Browser, expect, Page } from "@playwright/test"
import { UserGroup } from "common/enums"

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
    
    await page.getByLabel('E-post *').click();    
    await page.getByLabel('E-post *').fill(email);

    await page.getByRole('button', { name: 'Dev logg inn' }).click();
    await expect(page).toHaveURL(`${process.env.BASEURL}/hjem`);
}

export function getUserEmail(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "contributor@motstanden.no"
        case UserGroup.Editor: return "editor@motstanden.no"
        case UserGroup.Administrator: return "admin@motstanden.no"
        case UserGroup.SuperAdministrator: return "superadmin@motstanden.no"
    }
}

export async function storageLogIn(browser: Browser, group: UserGroup) {
    const context = await browser.newContext({ storageState: getStoragePath(group)}) 
    const page = await context.newPage()
    await page.goto("/hjem")
    return page
}