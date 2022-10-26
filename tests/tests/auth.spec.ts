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

test.describe("Login tokens are created and persisted", () => {

    test("Should create AccessToken and RefreshTokens on login", async ({ page }) => {
        await logIn(page, UserGroup.Contributor)
        const cookies = await page.context().cookies()
        
        expect(cookies.length).toBe(2)
        
        const accessToken = cookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()

        const refreshToken = cookies.find(c => c.name === "RefreshToken")
        expect(refreshToken).toBeDefined()
    })

    test("AccessToken expires within 15 minutes", async ({page}) => {

        await logIn(page, UserGroup.Contributor)

        const cookies = await page.context().cookies()
        const accessToken = cookies.find(c => c.name === "AccessToken")

        // Test that AccessToken expires within 15 minutes
        expect(accessToken.expires * 1000).toBeLessThanOrEqual(Date.now() + 1000*60*15)
    })

    test("Should renew AccessToken if browser only has RefreshToken", async ({page}) => {
        await logIn(page, UserGroup.Contributor)

        const initialCookies = await page.context().cookies()
        const expiredCookies = initialCookies.filter( c => c.name !== "AccessToken")
        await page.context().clearCookies()
        await page.context().addCookies(expiredCookies)

        await page.goto("/sitater")
        await expect(page).toHaveURL("/sitater")

        const newCookies = await page.context().cookies()
        const accessToken = newCookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()
    })

})

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