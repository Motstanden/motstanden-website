import { Cookie, TestInfo, expect, test, type Page } from '@playwright/test';
import { PublicCookieName } from 'common/enums';
import { unsafeApiLogIn } from '../utils/auth.js';
import { SideDrawerNavigation, navigateSideDrawer } from '../utils/navigateSideDrawer.js';

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
        await page.goto("/hjem")
    })

    test("AccessToken and RefreshTokens is defined", async ({page}) => {

        const cookies = await page.context().cookies()
        expect(cookies.length).toBe(3)
        
        const accessToken = cookies.find(c => c.name === "AccessToken")
        expect(accessToken).toBeDefined()
    
        const refreshToken = cookies.find(c => c.name === "RefreshToken")
        expect(refreshToken).toBeDefined()

        const userInfo = cookies.find(c => c.name === PublicCookieName.UnsafeUserInfo)
        expect(userInfo).toBeDefined()

        // Test that AccessToken expires within 15 minutes
        expect(accessToken.expires * 1000).toBeLessThanOrEqual(Date.now() + 1000*60*15)
    })

    test("AccessToken is renewed if browser only has RefreshToken", async ({page}, workerInfo) => {
        
        const getAccessToken = async (): Promise<Cookie | undefined> => {
            const cookies = await page.context().cookies()
            const token = cookies.find(c => c.name === "AccessToken") 
            return token
        }

        await expireCookie(page, CookieName.AccessToken)
        const oldAccessToken = await getAccessToken()
        expect(oldAccessToken).not.toBeDefined()

        // Refresh the tokens by navigating to a page that requires authentication
        await navigateSideDrawer(page, SideDrawerNavigation.Quotes)

        // I wrote this hack because: 
        //      1. I don't want to spend time figuring out exactly when the browser instantiates the token.
        //      2. It performs better than simply just waiting for the page to completely load.
        while( !(await getAccessToken()) ) 
            await page.waitForTimeout(100);


        const newAccessToken = await getAccessToken()
        expect(newAccessToken).toBeDefined()
    })

    test("UnsafeUserInfo is renewed if browser only has RefreshToken", async ({page}) => {
        
        const getUserInfo = async (): Promise<Cookie | undefined> => {
            const cookies = await page.context().cookies()
            const token = cookies.find(c => c.name === PublicCookieName.UnsafeUserInfo) 
            return token
        }

        await expireCookie(page, CookieName.UnsafeUserInfo)
        await expireCookie(page, CookieName.AccessToken)

        const oldUserInfo = await getUserInfo()
        expect(oldUserInfo).not.toBeDefined()

        // Refresh the tokens by navigating to a page that requires authentication
        await navigateSideDrawer(page, SideDrawerNavigation.Quotes)

        // I wrote this hack because: 
        //      1. I don't want to spend time figuring out exactly when the browser instantiates the token.
        //      2. It performs better than simply just waiting for the page to completely load.
        while( !(await getUserInfo()) ) 
            await page.waitForTimeout(100);

        const newUserInfo = await getUserInfo()
        expect(newUserInfo).toBeDefined()
    })
})

test.describe( "User can log out", () => {
    
    test("Log out in current browser", async ({ page }, workerInfo) => {        
        await logIntoReservedUser(page, workerInfo)
        await page.goto("/hjem")

        await page.getByRole('button', { name: 'Profilmeny' }).click();
        await page.getByRole('menuitem', { name: 'Logg ut', exact: true }).click()
        await page.waitForURL("/")

        await testUserIsLoggedOut(page)

    });

    test("Log out of all browser @smoke", async ({ browser }, workerInfo) => {
    
        const newLoginContext = async (): Promise<Page> => {
            const context = await browser.newContext()
            const page = await context.newPage()
            await logIntoReservedUser(page, workerInfo)
            await page.goto("/hjem")    
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
            await page2.waitForURL("/")

            await testUserIsLoggedOut(page2)

            await disposePage(page2)
        })

        await test.step("Test that the user is logged out of other browser", async () => {

            // The user should be logged out when the AccessToken expires.
            await expireCookie(page1, CookieName.AccessToken)

            await testUserIsLoggedOut(page1)

            await disposePage(page1)
        })  
    })
});

async function expireCookie(page: Page, cookieName: CookieName) {
    // ideally we would be able to fast forward the browser to a time when the AccessToken has expired.
    // This is not possible at the moment (October 27th, 2022).
    // We will therefore simulate this by manually deleting the AccessToken cookie
    const oldCookies = await page.context().cookies()
    const newCookies = oldCookies.filter( c => c.name !== cookieName)
    await page.context().clearCookies()
    await page.context().addCookies(newCookies)
}

enum CookieName {
    AccessToken = "AccessToken",
    RefreshToken = "RefreshToken",
    UnsafeUserInfo = PublicCookieName.UnsafeUserInfo
}

async function testUserIsLoggedOut(page: Page) {
    await page.goto('/hjem');
    await expect(page.getByRole('link', { name: 'Logg Inn' })).toBeVisible()
    await expect(page).toHaveURL('/logg-inn');
    const cookies = await page.context().cookies()
    expect(cookies.length).toBe(0)
}