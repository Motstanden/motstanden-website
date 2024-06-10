import { Browser, Page, TestInfo, expect, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { disposeLogIn, logIn } from '../../utils/auth.js';
import { randomString } from '../../utils/randomString.js';

test.describe("Contributor can create, edit and delete wall posts they have created", async () => { 

    test.describe.configure({ mode: "serial"})

    test("New wall post", async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)

        await gotoWallPostPage(page)
        await createWallPost()

        // TODO: Test wall post exists

        await disposeLogIn(page)
    })

    test("Edit wall post", async ({browser}, workerInfo) => { 
        // TODO
    })

    test("Delete wall post", async ({browser}, workerInfo) => { 
        await testDeleteWallPost(browser, workerInfo, UserGroup.Contributor)
    })

})

test.describe("Admin can delete all wall posts", async () => { 

    test.beforeAll( async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)

        await gotoWallPostPage(page)
        await createWallPost()

        await disposeLogIn(page)
    })
    
    test("Delete wall post", async ({browser}, workerInfo) => {
        await testDeleteWallPost(browser, workerInfo, UserGroup.Administrator)
    })
})

async function testDeleteWallPost(browser: Browser, workerInfo: TestInfo, group: UserGroup) { 
    const { page } = await logIn(browser, workerInfo, group)

    // TODO

    await disposeLogIn(page)
}
    

async function gotoWallPostPage(page: Page) {
    await page.goto("/vegg")
    // Wait for api response
}

async function createWallPost() {

}