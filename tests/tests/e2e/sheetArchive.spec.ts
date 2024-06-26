import { Browser, expect, Page, test, TestInfo } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { SheetArchiveTitle } from 'common/interfaces'
import { randomUUID } from "crypto"
import { disposeLogIn, logIn } from '../../utils/auth.js'

test.describe("Update song title info", async () => {
    test("Admin can update data @smoke", async ({browser}, workerInfo) => await runTest(browser, workerInfo, UserGroup.Administrator))

    test("Super admin can update data", async ({browser}, workerInfo) => await runTest(browser, workerInfo, UserGroup.SuperAdministrator))

    async function runTest(browser: Browser, workerInfo: TestInfo, userGroup: UserGroup) {
        const { page } = await logIn(browser, workerInfo, userGroup)

        const song = getSong(workerInfo)   // We must get a different song per individual worker to avoid race conditions

        await testUpdateSongTitle({page: page, song: song})
        await disposeLogIn(page)
    }
})

// NB: This list must be updated if there are more than 20 worker threads running tests concurrently
function getSong(workerInfo: TestInfo): string {
    switch(workerInfo.parallelIndex) {
        case 0: return "99 luftballons"
        case 1: return "a swinging safari"
        case 2: return "anchors aweigh"
        case 3: return "another brick in the wall"
        case 4: return "axel f"
        case 5: return "bruremarsj"
        case 6: return "can-can"
        case 7: return "dixieland strut"
        case 8: return "dyreparkens røvermarsj"
        case 9: return "funkytown"
        case 10: return "gonna fly now"
        case 11: return "happy"
        case 12: return "holmenkollmarsj"
        case 13: return "ice cream"
        case 14: return "killing in the name"
        case 15: return "norge i rødt hvitt og blått"
        case 16: return "nu klinger"
        case 17: return "olsenbanden"
        case 18: return "the bare necessities"
        case 19: return "through the fire and flames"
        default: throw `Maximum worker count reached. ` +
                       `\nRace condition will occur in this tests if there exists more than 6 concurrent workers. ` +
                       `\nIndex of current worker: ${workerInfo.parallelIndex}. ` +
                       `\nThe issue can be resolved by adding more sheet archive titles to version control, ` +
                       `\nor manually limit the amount of workers in playwright. For example:`
    }                  `\n\tnpx playwright test --workers 6`
}

const songNotFoundMsg = (song: string) => `The song "${song}" is not visible on the page /notearkiv/repertoar.
This occurs if you have manually edited the sheet archive page,
or if this test did not finish correctly the last time it was run.

To fix this, you need to rebuild the sheet archive database:
    cd database
    ./create_sheet_archive_dev_db.sh
`;

interface TitleData extends Pick<SheetArchiveTitle, "title" | "isRepertoire" | "extraInfo"> {}

async function testUpdateSongTitle( {page, song}: {page: Page, song: string | RegExp}) {
    await page.goto("/notearkiv/repertoar")

    const row = page.getByRole('row', { name: song })
    expect(row, songNotFoundMsg(song.toString())).toBeVisible({timeout: 10000})

    await row.getByRole('button').click();
    const saveButton = page.getByRole('button', { name: 'Lagre' })
    
    const titleBox = page.getByLabel('Tittel *')
    const extraInfoBox = page.getByLabel('Laget av')
    const repertoireCheckbox = page.getByLabel('Repertoar')

    const data1: TitleData = {
        title: await titleBox.inputValue(),
        extraInfo: await extraInfoBox.inputValue(),
        isRepertoire: true
    } 

    const data2: TitleData = {
        title: `00__test-title__${randomUUID()}`,
        extraInfo: `00__test-extra-info__${randomUUID()}`,
        isRepertoire: false
    }

    const fillForm = async (data: TitleData) => {
        await titleBox.fill(data.title)
        await extraInfoBox.fill(data.extraInfo)
        await repertoireCheckbox.setChecked(data.isRepertoire)
        await Promise.all([
            saveButton.click(),
            saveButton.waitFor({state: "detached"})
        ])
        await page.waitForLoadState('networkidle')
    }
    
    await fillForm(data2)
    
    const titleLocator1 = page.getByRole('row', { name: data1.title })
    const titleLocator2 = page.getByRole('row', { name: data2.title })
     
    await expect(titleLocator1).not.toBeVisible()
    await expect(titleLocator2).not.toBeVisible()

    await page.getByRole('tab', { name: 'Alle' }).click()
    await page.waitForURL("/notearkiv/alle")

    await expect(titleLocator1).not.toBeVisible()
    await expect(titleLocator2).toBeVisible()
    await expect(titleLocator2.getByText(data2.extraInfo)).toBeVisible()
    
    await page.getByRole('row', { name: data2.title }).getByRole('button').click()
    await fillForm(data1)

    await expect(titleLocator1).toBeVisible()
    await expect(titleLocator2).not.toBeVisible()
    
    await page.getByRole('tab', { name: 'Repertoar' }).click()
    await page.waitForURL("/notearkiv/repertoar")

    await expect(titleLocator1).toBeVisible()
    await expect(titleLocator2).not.toBeVisible()
}