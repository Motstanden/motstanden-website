import { Browser, Page, TestInfo, expect, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { disposeLogIn, logIn } from '../../utils/auth.js';
import { randomString } from '../../utils/randomString.js';

test.describe.serial("Contributor can create, edit and delete wall posts they have created", async () => { 

    let postContent: string

    test("New wall post", async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)

        // Arrange
        await gotoWallPostPage(page)
        postContent = randomString("Vegg post")

        // Act
        await Promise.all([
            createWallPost(page, postContent),
            page.waitForResponse(allWallPostsApi)
        ])

        // Assert
        await expect(page.getByText(postContent)).toBeVisible()

        await disposeLogIn(page)
    })

    test("Edit wall post", async ({browser}, workerInfo) => { 
        // TODO
        test.skip(true, "Not implemented")
    })

    test("Delete wall post", async ({browser}, workerInfo) => { 
        await testDeleteWallPost(browser, workerInfo, UserGroup.Contributor, postContent)
    })

})

test.describe("Admin can delete all wall posts", async () => { 

    let postContent = randomString("Vegg post")

    test.beforeAll( async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)

        await page.goto("/vegg"),
        await createWallPost(page, postContent)

        await disposeLogIn(page)
    })
    
    test("Delete wall post", async ({browser}, workerInfo) => {
        await testDeleteWallPost(browser, workerInfo, UserGroup.Administrator, postContent)
    })
})

async function testDeleteWallPost(browser: Browser, workerInfo: TestInfo, group: UserGroup, postContent: string) { 
    const { page } = await logIn(browser, workerInfo, group)

    // Arrange
    await gotoWallPostPage(page)
    
    // Act
    await clickMenuButton(page, postContent)
    await Promise.all([
        clickDelete(page),
        page.waitForResponse(allWallPostsApi)
    ])

    // Assert
    await expect(page.getByText(postContent)).not.toBeVisible()

    await disposeLogIn(page)
}

const allWallPostsApi = '/api/wall-posts/all'

async function gotoWallPostPage(page: Page) {
    await Promise.all([
        page.goto("/vegg"),
        page.waitForResponse(allWallPostsApi)
    ])
}

async function createWallPost(page: Page, content: string) {
    await page.getByLabel('Skriv en ny veggpost...')
        .getByRole('textbox')
        .fill(content)
    await page.getByRole('button', { name: 'Post', exact: true }).click()
}

async function clickDelete(page: Page) {
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole("menuitem", { name: "Slett" }).click()
}

async function clickMenuButton(page: Page, postContent: string) {
    const menuButton = page.getByLabel("Veggpost")
        .filter( {hasText: postContent})
        .getByRole("button", { name: "Veggpostmeny" })
    await menuButton.click()
}