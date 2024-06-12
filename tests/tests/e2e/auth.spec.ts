import { TestInfo, expect, test, type Page } from '@playwright/test';
import { unsafeApiLogIn } from '../../utils/auth.js';

function getReservedMail(workerInfo: TestInfo) {
    return `test-auth-${workerInfo.parallelIndex + 1}@motstanden.no`
}

// We must do a manual log in to prevent flaky tests.
// A race condition will eventually occur and fail the tests if we try to log in with storage state.
// The condition for this race condition are:
//      - The tests has been running repeatedly for more than 14 minutes.
//        This can happen if you are hunting for flaky tests.
//      - The AccessToken expires at a random time during the test
async function logIntoReservedUser(page: Page, workerInfo: TestInfo) {
    const reservedUser = getReservedMail(workerInfo)
    await unsafeApiLogIn(page.request, reservedUser)
}

test.describe("Login tokens are created and persisted", () => {

    test.beforeEach(async ({page}, workerInfo) => {
        await logIntoReservedUser(page, workerInfo)
    })

    test("AccessToken and RefreshTokens is defined", async ({page}) => {

        const cookies = await page.context().cookies()
        expect(cookies.length).toBe(2)
        
        const accessToken = cookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()
    
        const refreshToken = cookies.find(c => c.name === "RefreshToken")
        expect(refreshToken).toBeDefined()

        // Test that AccessToken expires within 15 minutes
        expect(accessToken.expires * 1000).toBeLessThanOrEqual(Date.now() + 1000*60*15)
    })

    test("AccessToken is renewed if browser only has RefreshToken", async ({page}) => {
        await expireCookie(page, CookieName.AccessToken)

        const oldAccessToken = await getCookie(page, CookieName.AccessToken)
        expect(oldAccessToken).not.toBeDefined()

        // Refresh the tokens by navigating to a page that requires authentication
        // Note: To avoid race conditions, it is important that we do not navigate to a page before expireCookie() is called. See comment in expireCookie() 
        await page.goto("/sitater", { waitUntil: "load" })
        await waitForCookie(page, CookieName.AccessToken)

        const newAccessToken = await getCookie(page, CookieName.AccessToken)
        expect(newAccessToken).toBeDefined()
    })
})

test.describe("Routes that require authentication are protected", () => { 

    // Same order as in the side drawer
    testRoute("/hjem")
    testRoute("/vegg")
    testRoute("/arrangement")
    testRoute("/sitater")
    testRoute("/rykter")
    testRoute("/avstemninger")

    testRoute("/notearkiv")
    testRoute("/studenttraller/populaere/asbest/rediger")
    testRoute("/studenttraller/alle/asbest/rediger")
    testRoute("/studenttraller/1/rediger")
    testRoute("/studenttraller/ny")

    testRoute("/medlem")

    testRoute("/kommentarer")
    testRoute("/admin")
    testRoute("/superadmin")

    function testRoute(route: string) {
        return test(route, async ({page}) => { 
            await Promise.all([
                page.waitForURL("/logg-inn"),
                page.goto(route)
            ])
            await expect(page).toHaveURL('/logg-inn')
        })
    }
})

test.describe( "User can log out", () => {
    
    test("Log out in current browser", async ({ page }, workerInfo) => {        
        await logIntoReservedUser(page, workerInfo)
        await page.goto("/sitater")

        await page.getByRole('button', { name: 'Profilmeny' }).click();
        await page.getByRole('menuitem', { name: 'Logg ut', exact: true }).click()
        await page.waitForURL("/framside")

        await testUserIsLoggedOut(page)
    });

    test("Log out of all browser @smoke", async ({ browser }, workerInfo) => {
    
        const newLoginContext = async (): Promise<Page> => {
            const context = await browser.newContext()
            const page = await context.newPage()
            await logIntoReservedUser(page, workerInfo)
            await page.goto("/sitater")    
            return page
        }

        const disposePage = async (page: Page) => {
            await page.context().close()
            await page.close()
        }

        const page1 = await newLoginContext()
        const page2 = await newLoginContext()
      
        // Log out of the last opened page to provide a nice viewing experience when running test in headed mode
        await test.step("Click 'log out of all units'", async () => {

            page2.once('dialog', dialog => dialog.accept());
            await page2.getByRole('button', { name: 'Profilmeny' }).click();
            await page2.getByRole('menuitem', { name: 'Logg ut alle enheter' }).click()
            await page2.waitForURL("/framside")

            await testUserIsLoggedOut(page2)

            await disposePage(page2)
        })

        await test.step("Test that the user is logged out of other browser", async () => {
            // The user should be logged out when the AccessToken expires.
            await expireCookie(page1, CookieName.AccessToken)

            page1.reload()
            await page1.waitForURL("/logg-inn")

            await testUserIsLoggedOut(page1)

            await disposePage(page1)
        })
        
    })
});

async function testUserIsLoggedOut(page: Page) {
    await expect(page.getByRole('link', { name: 'Logg inn' })).toBeVisible()
    const cookies = await page.context().cookies()
    expect(cookies.length).toBe(0)
}

async function getCookie(page: Page, cookieName: CookieName) {
    const cookies = await page.context().cookies()
    const token = cookies.find(c => c.name === cookieName.toString()) 
    return token
}

async function waitForCookie(page: Page, cookieName: CookieName) {
    while( !(await getCookie(page, cookieName))) {
        await page.waitForTimeout(200);
    } 
}

// **** This function is prone to a race condition. Use it carefully!! ****
// Date: 2024-06-10
//
// The following race condition costed me so many hours of debugging.
// Here is the scenario:
//      1. The current page is somewhere in the application.
//      2. We delete all cookies: context.clearCookies()
//      3. Immediately after deleting the cookies, the application happens to randomly send a request to the server (now without a refresh token cookie) 
//      4. We manually add the cookies again: context.addCookies()
//      5. The server receives the request in step 3 and responds by deleting all cookies.
//      6. Now the browser has zero cookies :-( 
//
// Update: 2024-06-10 
// The function has now been updated.
//
// It now uses clearCookies with a filter option that was just introduced in Playwright 1.43
// https://playwright.dev/docs/release-notes#version-143
//
// The aforementioned race condition is now possibly fixed. 
// But I am not sure. 
//
async function expireCookie(page: Page, cookieName: CookieName) {
    const context = page.context()
    await context.clearCookies( { name: cookieName } )
}

enum CookieName {
    AccessToken = "AccessToken",
    RefreshToken = "RefreshToken",
}
