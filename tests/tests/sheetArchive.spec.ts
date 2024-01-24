import { Browser, expect, Page, test, TestInfo } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { SheetArchiveTitle } from 'common/interfaces';
import { randomUUID } from "crypto";
import { disposeLogIn, logIn } from '../utils/auth.js';
import { navClick } from '../utils/navClick.js';

test.describe("Update song title info", async () => {
    test("Admin can update data @smoke", async ({browser}, workerInfo) => await runTest(browser, workerInfo, UserGroup.Administrator))

    test("Super admin can update data", async ({browser}, workerInfo) => await runTest(browser, workerInfo, UserGroup.SuperAdministrator))

    async function runTest(browser: Browser, workerInfo: TestInfo, userGroup: UserGroup) {
        const { page } = await logIn(browser, workerInfo, userGroup)

        let song: string
        try {
            song = getSong(workerInfo)   // We must get a different song per individual worker to avoid race conditions
        } catch (err) {
            test.skip(err)
        }

        await testUpdateSongTitle({page: page, song: song})
        await disposeLogIn(page)
    }
})

function getSong(workerInfo: TestInfo): string {
    switch(workerInfo.parallelIndex) {
        case 0: return "nu klinger"
        case 1: return "killing in the name"
        case 2: return "ice cream"
        case 3: return "another brick in the wall"
        case 4: return "can-can"
        case 5: return "through the fire and flames"
        default: throw `Maximum worker count reached. ` +
                       `\nRace condition will occur in this tests if there exists more than 6 concurrent workers. ` +
                       `\nIndex of current worker: ${workerInfo.parallelIndex}. ` +
                       `\nThe issue can be resolved by adding more sheet archive titles to version control, ` +
                       `\nor manually limit the amount of workers in playwright. For example:`
    }                  `\n\tnpx playwright test --workers 6`
}

interface TitleData extends Pick<SheetArchiveTitle, "title" | "isRepertoire" | "extraInfo"> {}

async function testUpdateSongTitle( {page, song}: {page: Page, song: string | RegExp}) {
    await page.goto("/notearkiv/repertoar")
    await page.getByRole('row', { name: song }).getByRole('button').click();
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

    await navClick(page.getByRole('tab', { name: 'Alle' }))

    await expect(titleLocator1).not.toBeVisible()
    await expect(titleLocator2).toBeVisible()
    await expect(titleLocator2.getByText(data2.extraInfo)).toBeVisible()
    
    await page.getByRole('row', { name: data2.title }).getByRole('button').click()
    await fillForm(data1)

    await expect(titleLocator1).toBeVisible()
    await expect(titleLocator2).not.toBeVisible()
    
    await navClick(page.getByRole('tab', { name: 'Repertoar' }))

    await expect(titleLocator1).toBeVisible()
    await expect(titleLocator2).not.toBeVisible()
}