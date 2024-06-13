import { Page, test } from "@playwright/test";
import { CommentEntityType, UserGroup } from "common/enums";


runTestSuite({ entityType: CommentEntityType.Event })
runTestSuite({ entityType: CommentEntityType.Poll })
runTestSuite({ entityType: CommentEntityType.SongLyric })
runTestSuite({ entityType: CommentEntityType.WallPost })

interface TestOptions {
    entityType: CommentEntityType    
}

function runTestSuite(opts: TestOptions) {
    test.describe.serial(`Comments on ${testName(opts.entityType)}`, () => {  

        test.describe.serial("Author can update, edit and delete", () => { 
            testAuthorCanUpdateEditAndDelete(opts.entityType)
        })
    
        testExternalDelete(opts.entityType)
    })
}

function testAuthorCanUpdateEditAndDelete( entityType: CommentEntityType ) { 
    test(`New `, async ({page}) => {    
        // TODO    
        test.skip()
    })

    test(`Edit `, async ({page}) => {    
        // TODO    
        test.skip()
    })

    test(`Delete `, async ({page}) => {    
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
    // return entityType.at(0).toUpperCase() + entityType.slice(1).replace("-", " ")
    return entityType.replace("-", " ")
}