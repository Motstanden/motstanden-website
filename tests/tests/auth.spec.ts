import test, { Browser, chromium, Cookie, expect, firefox, webkit, type Page } from '@playwright/test';
import { emailLogIn } from '../utils/auth.js';
import { navClick } from '../utils/navClick.js';

test("Login tokens are created and persisted", async ({page}) => {

    // We must do a manual log in to prevent flaky tests.
    // A race condition will eventually occur and fail the tests if we try to log in with storage state.
    // The condition for this race condition are:
    //      - The tests has been running repeatedly for more than 14 minutes.
    //        This can happen if you are hunting for flaky tests.
    //      - The AccessToken expires at a random time during the test
    await emailLogIn(page, "stephen.hawking@gmail.com")

    await test.step("AccessToken and RefreshTokens is defined", async () => {
        const cookies = await page.context().cookies()
        expect(cookies.length).toBe(2)
        
        const accessToken = cookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()
    
        const refreshToken = cookies.find(c => c.name === "RefreshToken")
        expect(refreshToken).toBeDefined()

        // Test that AccessToken expires within 15 minutes
        expect(accessToken.expires * 1000).toBeLessThanOrEqual(Date.now() + 1000*60*15)
    })

    await test.step("AccessToken is renewed if browser only has RefreshToken", async () => {
        
        const getAccessToken = async (): Promise<Cookie | undefined> => {
            const cookies = await page.context().cookies()
            const token = cookies.find(c => c.name === "AccessToken") 
            return token
        }

        await expireAccessToken(page)
        const oldAccessToken = await getAccessToken()
        expect(oldAccessToken).not.toBeDefined()

        await page.reload()

        // I wrote this hack because: 
        //      1. I don't want to spend time figuring out exactly when the browser instantiates the token.
        //      2. It performs better than simply just waiting for the page to completely load.
        while( !(await getAccessToken()) ) 
            await page.waitForTimeout(100);


        const newAccessToken = await getAccessToken()
        expect(newAccessToken).toBeDefined()
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
        await navClick(page.getByRole('menuitem', { name: 'Logg ut', exact: true }))

        await expect(page).toHaveURL('')
        await testUserIsLoggedOut(page)

    });

    test("Log out of all browser @smoke", async ({ browser }) => {
    
        const newLoginContext = async (): Promise<Page> => {
            const context = await browser.newContext()
            const page = await context.newPage()
            const userMail = getMail(browser)
            await emailLogIn(page, userMail)
            return page
        }

        const page1 = await newLoginContext()
        const page2 = await newLoginContext()
      
        await test.step("Click 'log out of all units'", async () => {

            // Log out of the last opened page to provide a nice viewing experience when running test in headed mode

            page2.once('dialog', dialog => dialog.accept());
            await page2.getByRole('button', { name: 'Profilmeny' }).click();
            await navClick(page2.getByRole('menuitem', { name: 'Logg ut alle enheter' }))
            
            await expect(page2).toHaveURL('')
            await testUserIsLoggedOut(page2)

            await page2.context().close()
        })

        await test.step("Test that the user is logged out of other browser", async () => {

            // The user should be logged out when the AccessToken expires.
            await expireAccessToken(page1)

            await testUserIsLoggedOut(page1)
            await page1.context().close()
        })  
    })
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
    await page.goto('/hjem');
    await expect(page.getByRole('link', { name: 'Logg Inn' })).toBeVisible()
    await expect(page).toHaveURL('/logg-inn');

    const cookies = await page.context().cookies()
    expect(cookies.length).toBe(0)
}