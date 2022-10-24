import test, { expect, type Page } from '@playwright/test';
import { UserGroup } from 'common/enums';

export async function logIn(page: Page, group: UserGroup) {
    const email = getUserEmail(group)
    await emailLogIn(page, email)
}

async function emailLogIn(page: Page, email: string) {
    await page.goto('/logg-inn');
    
    await page.getByLabel('E-post *').click();    
    await page.getByLabel('E-post *').fill(email);

    await page.getByRole('button', { name: 'Dev logg inn' }).click();
    await expect(page).toHaveURL('/hjem');
}

export function getUserEmail(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "contributor@motstanden.no"
        case UserGroup.Editor: return "editor@motstanden.no"
        case UserGroup.Administrator: return "admin@motstanden.no"
        case UserGroup.SuperAdministrator: return "superadmin@motstanden.no"
    }
}

test.describe("User can log out", () => {
    test("Log out in current browser", async ({ page }) => {
        await emailLogIn(page, "web@motstanden.no")

        await page.getByRole('button', { name: 'Profilmeny' }).click();
        await page.getByRole('menuitem', { name: 'Logg ut' }).click();

        await expect(page).toHaveURL('')
        await testUserIsLoggedOut(page)
    });
  
    test.fixme("Log out in all browser", async ({ page }) => {
        // ...
    });
});

async function testUserIsLoggedOut(page: Page) {
    const cookies = await page.context().cookies()
    expect(cookies.length).toBe(0)

    await page.goto("")
    await expect(page.getByRole('link', { name: 'Logg Inn' })).toBeVisible()
    await page.goto('/hjem');
    await expect(page).toHaveURL('/logg-inn');
    await page.goto('/sitater');
    await expect(page).toHaveURL('/logg-inn');
}