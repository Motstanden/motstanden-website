import { APIRequestContext, Browser, Page, TestInfo, expect, test } from "@playwright/test";
import { CommentEntityType, UserGroup } from "common/enums";
import { NewComment } from "common/interfaces";
import { TestUser, disposeLogIn, logIn } from "../../utils/auth.js";
import { randomString } from "../../utils/randomString.js";


runTestSuite({ 
    entityType: CommentEntityType.Event, 
    entityId: 1
})
runTestSuite({ 
    entityType: CommentEntityType.Poll,  
    entityId: 1
})
runTestSuite({ 
    entityType: CommentEntityType.SongLyric,  
    entityId: 1
})
runTestSuite({ 
    entityType: CommentEntityType.WallPost,  
    entityId: 1
})

interface TestOptions {
    entityType: CommentEntityType,
    entityId: number    
}

function runTestSuite(opts: TestOptions) {
    test.describe.serial(`Comment on ${testName(opts.entityType)}`, () => {  

        test.describe.serial("Author can update, edit and delete", () => { 
            testAuthorCanUpdateEditAndDelete(opts)
        })
    
        test("Admin can delete", async ({browser}, workerInfo) => {
            await runDeleteTestWithSetup({
                entityType: opts.entityType, 
                entityId: opts.entityId, 
                deleter: UserGroup.Administrator,
                browser: browser,
                workerInfo: workerInfo
            })
        })
    
        test("Superadmin can delete", async ({browser}, workerInfo) => {
            await runDeleteTestWithSetup({
                entityType: opts.entityType, 
                entityId: opts.entityId,
                deleter: UserGroup.SuperAdministrator,
                browser: browser,
                workerInfo: workerInfo
            })
        })
    })
}

function testAuthorCanUpdateEditAndDelete( {entityId, entityType}: TestOptions) { 

    let page: Page
    let user: TestUser
    let comment: string

    test.beforeAll(async ({browser}, workerInfo) => { 
        const loginInfo = await logIn(browser, workerInfo, UserGroup.Contributor)
        page = loginInfo.page
        user = loginInfo.user
        await gotoPage(page, entityType)
    })

    test.afterAll(async () => { 
        await disposeLogIn(page)
    })

    test(`New `, async () => {    
        comment = randomString("New comment")

        const commentInput = page.getByLabel('Skriv en kommentar... *')
        const commentButton = page.getByRole('button', { name: 'Kommenter' })

        await commentInput.fill(comment)
        await commentButton.click()

        const commentLocator = getCommentLocator(page, comment)
        await expect(commentLocator).toBeVisible()
    })

    test(`Edit `, async () => {    
        // TODO    
        test.skip()
    })

    test(`Delete `, async () => {    
        await runDeleteTest({ entityType, entityId, comment, page })
    })
}

async function runDeleteTest({
    page, 
    entityType, 
    entityId, 
    comment
}: {
    page: Page,
    entityType: CommentEntityType,
    entityId: number,
    comment: string
}) {
    await clickMenuButton(page, comment)    // Assume we are already on the page

    await Promise.all([
        clickDelete(page),
        waitForCommentsResponse(page, entityType)
    ])

    const commentLocator = getCommentLocator(page, comment)
    await expect(commentLocator).not.toBeVisible()
}


async function runDeleteTestWithSetup({
    entityType, 
    entityId, 
    deleter, 
    browser, 
    workerInfo
}: {
    entityType: CommentEntityType,
    entityId: number,
    deleter: UserGroup,
    browser: Browser,
    workerInfo: TestInfo
}) {
    
    const postCommentAs = async (group: UserGroup, comment: string) => {
        const { page } = await logIn(browser, workerInfo, group)
        await postCommentToApi(page.request, entityType, entityId, comment)
        await disposeLogIn(page)
    }

    // Create and post a new comment
    const comment = randomString(`Comment on ${entityType} ${entityId}`)
    await postCommentAs(UserGroup.Contributor, comment)

    // Log in as the deleter
    const { page } = await logIn(browser, workerInfo, deleter)
    await gotoPage(page, entityType, entityId)
    
    // Run tests
    await runDeleteTest({ entityType, entityId, comment, page })

    await disposeLogIn(page)
}

async function gotoPage(page: Page, entityType: CommentEntityType, entityId: number = 1) {
    const url = buildPageUrl(entityType, entityId)
    await page.goto(url)
}

function getCommentLocator(page: Page, comment: string) {
    return page.getByLabel("Kommentar", { exact: false })
        .filter({ hasText: comment })
}

async function clickMenuButton(page: Page, comment: string) {
    const button = getCommentLocator(page, comment)
        .getByRole("button", {name: "Kommentarmeny"})
    await button.click()
} 

async function clickDelete(page: Page) {
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole("menuitem", {name: "Slett"}).click()
}

async function clickEdit(page: Page) {
    const button = page.getByRole("menuitem", {name: "Rediger"})
    await button.click()
}

function buildPageUrl(entityType: CommentEntityType, entityId: number): string {
    switch(entityType) { 
        case CommentEntityType.Event:
            return `/arrangement/${entityId}`
        case CommentEntityType.Poll:
            return `/avstemninger/${entityId}`
        case CommentEntityType.SongLyric:
            return `/studenttraller/${entityId}`
        case CommentEntityType.WallPost:
            return `/vegg/${entityId}`
        default:
            throw "Not implemented"
    }
}


async function waitForCommentsResponse(page: Page, entityType: CommentEntityType) {
    const urlPattern = new RegExp(`/api/${entityType}/comments/\\d+`)
    return await page.waitForResponse(urlPattern)
}

// Posting a comment through the api is significantly faster than through the UI
async function postCommentToApi(api: APIRequestContext, entityType: CommentEntityType, entityId: number, comment: string, ) { 
    const data: NewComment = { 
        comment: comment 
    }
    const res = await api.post(`/api/${entityType}/${entityId}/comments/new`, {data: data})
    if(!res.ok()) {
        throw new Error(`Failed to create ${entityType} comment.\n${await res.text()}`)
    }
}

function testName(entityType: CommentEntityType) {
    return entityType.replace("-", " ")
}