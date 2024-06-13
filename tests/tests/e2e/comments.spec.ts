import { Page, expect, test } from "@playwright/test";
import { CommentEntityType, UserGroup } from "common/enums";
import { TestUser, disposeLogIn, logIn } from "../../utils/auth.js";
import { randomString } from "../../utils/randomString.js";


runTestSuite({ entityType: CommentEntityType.Event })
runTestSuite({ entityType: CommentEntityType.Poll })
runTestSuite({ entityType: CommentEntityType.SongLyric })
runTestSuite({ entityType: CommentEntityType.WallPost })

interface TestOptions {
    entityType: CommentEntityType    
}

function runTestSuite(opts: TestOptions) {
    test.describe.serial(`Comment on ${testName(opts.entityType)}`, () => {  

        test.describe.serial("Author can update, edit and delete", () => { 
            testAuthorCanUpdateEditAndDelete(opts.entityType)
        })
    
        testExternalDelete(opts.entityType)
    })
}

function testAuthorCanUpdateEditAndDelete( entityType: CommentEntityType ) { 

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
        // TODO    
        test.skip()
    })
}

function testExternalDelete(entityType: CommentEntityType) { 

    test("Admin can delete", async () => {
        await testDelete(entityType, UserGroup.Administrator)
    })

    test("Superadmin can delete", async () => {
        await testDelete(entityType, UserGroup.SuperAdministrator)
    })

    async function testDelete(entityType: CommentEntityType, deleter: UserGroup) {
        // TODO
        test.skip()
    }
}

async function gotoPage(page: Page, entityType: CommentEntityType) {
    const id = 1
    const url = buildUrl(entityType, id)
    await page.goto(url)
}

function getCommentLocator(page: Page, comment: string) {
    return page.getByLabel("Kommentar", { exact: false })
        .filter({ hasText: comment })
}

function buildUrl(entityType: CommentEntityType, entityId: number): string {
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

function testName(entityType: CommentEntityType) {
    return entityType.replace("-", " ")
}