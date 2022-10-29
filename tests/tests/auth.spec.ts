import test, { expect, type Page } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { getStoragePath, storageLogIn } from '../utils/auth';

test.describe("Login tokens are created and persisted", () => {

    test.use({ storageState: getStoragePath(UserGroup.Contributor)})

    test("Should create AccessToken and RefreshTokens on login", async ({ page }) => {
        const cookies = await page.context().cookies()
        
        expect(cookies.length).toBe(2)
        
        const accessToken = cookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()

        const refreshToken = cookies.find(c => c.name === "RefreshToken")
        expect(refreshToken).toBeDefined()
    })

    test("AccessToken expires within 15 minutes", async ({page}) => {
        const cookies = await page.context().cookies()
        const accessToken = cookies.find(c => c.name === "AccessToken")

        // Test that AccessToken expires within 15 minutes
        expect(accessToken.expires * 1000).toBeLessThanOrEqual(Date.now() + 1000*60*15)
    })

    test("Should renew AccessToken if browser only has RefreshToken", async ({page}) => {
        await expireAccessToken(page)

        await page.goto("/sitater")
        await expect(page).toHaveURL("/sitater")

        const newCookies = await page.context().cookies()
        const accessToken = newCookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()
    })

})

test.describe("User can log out", () => {
    
    test("Log out in current browser", async ({ browser }) => {
        
        const page = await storageLogIn(browser, UserGroup.Contributor)
        
        await page.getByRole('button', { name: 'Profilmeny' }).click();
        await page.getByRole('menuitem', { name: 'Logg ut' }).click();

        await expect(page).toHaveURL('')
        await testUserIsLoggedOut(page)

        await page.context().close()
    });
  
    test("Log out of all browser", async ({ browser }) => {
        
        // Log in on multiple isolated pages
        const p1 = await storageLogIn(browser, UserGroup.Editor)
        const p2 = await storageLogIn(browser, UserGroup.Editor)
        const p3 = await storageLogIn(browser, UserGroup.Editor)

        const pages = [p1, p2, p3]

        await test.step("Click 'log out of all units'", async () => {
            const page = pages[pages.length - 1]

            page.once('dialog', dialog => dialog.accept());
            await page.getByRole('button', { name: 'Profilmeny' }).click();
            await page.getByRole('menuitem', { name: 'Logg ut alle enheter' }).click();
            
            await expect(page).toHaveURL('')
            await testUserIsLoggedOut(page)
        })

        await test.step("Test that the user is logged out of all browsers", async () => {
            for(let i = 0; i < pages.length; i++){
                const page = pages[i]
                
                // The user should be logged out when the AccessToken expires.
                await expireAccessToken(page)
                
                // A page reload will trigger the client to request a new AccessToken. 
                // The server should refuse to generate a new token.
                await page.reload()
                
                await expect(page).toHaveURL('/logg-inn')
                await testUserIsLoggedOut(page)
                
                await page.context().close()
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