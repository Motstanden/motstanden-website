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

        await expireAccessToken(page)

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
  
    test("Log out of all browser", async ({ browser }) => {
        
        await browser.newContext()
        await browser.newContext()
        await browser.newContext()
        const contexts = browser.contexts()

        await test.step("Log in in all browsers", async () => {
            for(let i = 0; i < contexts.length; i++) {
                const page = await contexts[i].newPage()
                await emailLogIn(page, "leder@motstanden.no")
            }
        })

        await test.step("Click 'log out of all units'", async () => {
            const page = contexts[0].pages()[0]

            page.once('dialog', dialog => dialog.accept());
            await page.getByRole('button', { name: 'Profilmeny' }).click();
            await page.getByRole('menuitem', { name: 'Logg ut alle enheter' }).click();
            
            await expect(page).toHaveURL('')
            await testUserIsLoggedOut(page)
        })

        await test.step("Test that the user is logged out of all browsers", async () => {
            for(let i = 1; i < contexts.length; i++){
                const page = contexts[i].pages()[0]
                
                // The user should be logged out when the AccessToken expires.
                await expireAccessToken(page)
                
                // A page reload will trigger the client to request a new AccessToken. 
                // The server should refuse to generate a new token.
                await page.reload()
                
                await expect(page).toHaveURL('/logg-inn')
                await testUserIsLoggedOut(page)
            }
        })

    });

});

async function expireAccessToken(page: Page) {
    // ideally we would be able to fast forward the browser to a time when the AccessToken has expired.
    // This is not possible at the moment.
    // We will therefore simulate this by manually deleting the AccessToken cookie
    const oldCookies = await page.context().cookies()
    const newCookies = oldCookies.filter( c => c.name !== "AccessToken")
    await page.context().clearCookies()
    await page.context().addCookies(newCookies)
}

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