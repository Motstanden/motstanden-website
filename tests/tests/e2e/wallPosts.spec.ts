import { Browser, Page, TestInfo, expect, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { TestUser, disposeLogIn, logIn, storageLogIn } from '../../utils/auth.js';
import { randomString } from '../../utils/randomString.js';

test.describe.serial("Contributor can create, edit and delete wall posts they have created", async () => { 

    let initialUser: TestUser
    let postContent: string

    test("New wall post", async ({browser}, workerInfo) => { 
        const { user, page } = await logIn(browser, workerInfo, UserGroup.Contributor)
        initialUser = user

        // Arrange
        await gotoWallPostPage(page)
        postContent = randomString("Ny veggpost")

        // Act
        await Promise.all([
            createWallPost(page, postContent),
            page.waitForResponse(allWallPostsApi)
        ])

        // Assert
        await expect(page.getByText(postContent)).toBeVisible()

        await disposeLogIn(page)
    })

    test("Edit wall post", async ({browser}) => { 
        const page = await storageLogIn(browser, initialUser)

        // Start editing
        await gotoWallPostPage(page)
        await clickMenuButton(page, postContent)
        await clickEdit(page)

        // Fill in new content
        postContent = randomString("Redigert veggpost")
        await page.getByLabel('Rediger post... *').fill(postContent)

        // Save and wait for db to server updated content
        await Promise.all([
            page.getByRole('button', { name: 'Lagre', exact: true }).click(),
            page.waitForResponse(allWallPostsApi)
        ])

        // Assert
        await expect(page.getByText(postContent)).toBeVisible()

        await disposeLogIn(page)
    })

    test("Delete wall post", async ({browser}, workerInfo) => { 
        await testDeleteWallPost(browser, workerInfo, UserGroup.Contributor, postContent)
    })

})

test.describe("Admin can delete all wall posts", async () => { 

    let postContent = randomString("Ny veggpost")

    test.beforeAll( async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)

        await page.goto("/vegg"),
        await createWallPost(page, postContent)
        await clickEdit(page)


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

async function clickEdit(page: Page) {
    await page.getByRole("menuitem", { name: "Rediger" }).click()
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