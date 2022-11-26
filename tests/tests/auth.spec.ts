import test, { Browser, chromium, expect, firefox, webkit, type Page } from '@playwright/test';
import { emailLogIn } from '../utils/auth';

test.describe("Login tokens are created and persisted", () => {

    test.beforeEach( async ({page}) => {
        // We must do a manual log in to prevent flaky tests.
        // A race condition will eventually occur and fail the tests if we try to log in with storage state.
        // The condition for this race condition are:
        //      - The tests has been running repeatedly for more than 14 minutes.
        //        This can happen if you are hunting for flaky tests.
        //      - The AccessToken expires at a random time during the test
        await emailLogIn(page, "stephen.hawking@gmail.com")
    })    

    test("Should create AccessToken and RefreshTokens on login", async ({page}) => {
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
        await expect(page).toHaveURL("/hjem")

        await expireAccessToken(page)
        await expect(page).toHaveURL("/hjem")

        await page.reload()
        await expect(page).toHaveURL("/hjem")

        await page.goto("/sitater")
        await expect(page).toHaveURL("/sitater")
        
        const newCookies = await page.context().cookies()
        const accessToken = newCookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()
    })

})

test.describe.serial( "User can log out", () => {
    
    // We need to provide a different user for each browser so that the tests can run isolated in parallel in different browsers.
    function getMail(browser: Browser) {
        const browserName = browser.browserType().name()
        
        if(browserName === chromium.name())
            return "alan.turing@gmail.com"

        if(browserName === firefox.name())
            return "linus.torvalds@gmail.com"

        if(browserName === webkit.name())
            return "albert.einstein@gmail.com"

        throw `The browser is not supported: "${browserName}"`
    }


    test("Log out in current browser", async ({ page, browser }) => {
        
        const userMail = getMail(browser)
        await emailLogIn(page, userMail)

        await page.getByRole('button', { name: 'Profilmeny' }).click();
        await page.getByRole('menuitem', { name: 'Logg ut', exact: true }).click();

        await expect(page).toHaveURL('')
        await testUserIsLoggedOut(page)

    });
  
    test("Log out of all browser @smoke", async ({ browser }) => {
        test.slow()

        const pages: Page[] = []
        const userMail = getMail(browser)
        for(let i = 0; i < 3; i++) {
            const context = await browser.newContext()
            const page = await context.newPage()
            await emailLogIn(page, userMail)
            pages.push(page)
        }

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