import { expect, Page, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { SheetArchiveTitle } from 'common/interfaces';
import { userGroupToPrettyStr } from 'common/utils';
import { getStoragePath } from '../utils/auth.js';
import { navClick } from '../utils/navClick.js';

test.describe("Admin can update song title data", async () => {
    await testUpdateSongTitle({ updater: UserGroup.Administrator, song: "ice cream" })
})

test.describe("Super admin can update song title data", async () => {
    await testUpdateSongTitle({ updater: UserGroup.SuperAdministrator, song: "killing in the name" })
})

interface TitleData extends Pick<SheetArchiveTitle, "title" | "isRepertoire" | "extraInfo"> {}

async function testUpdateSongTitle( {song, updater}: { song: string | RegExp, updater: UserGroup }) {
    test.use({ storageState: getStoragePath(updater) })

    test(`Updating ${song} as ${userGroupToPrettyStr(updater)}`, async ({page}) => {
        await page.goto("/notearkiv/repertoar")

        const editButton = page.getByRole('row', { name: song }).getByRole('button') 
        await editButton.click();
        const saveButton = page.getByRole('button', { name: 'Lagre' })
        
        const titleBox = page.getByLabel('Tittel *')
        const extraInfoBox = page.getByLabel('Laget av')
        const repertoireCheckbox = page.getByLabel('Repertoar')

        const oldData: TitleData = {
            title: await titleBox.textContent(),
            extraInfo: await extraInfoBox.textContent(),
            isRepertoire: true
        } 

        const newData: TitleData = {
            title: `__test__${oldData.title}`,
            extraInfo: `__test__${oldData.extraInfo}`,
            isRepertoire: false
        }

        const fillForm = async (data: TitleData) => {
            await titleBox.fill(data.title)
            await extraInfoBox.fill(data.extraInfo)
            await repertoireCheckbox.setChecked(data.isRepertoire)
            await saveButton.click()
        }
        
        fillForm(newData)

        testVisibility({page: page, data: oldData, isVisible: false})
        testVisibility({page: page, data: newData, isVisible: false})
        await navClick(page.getByRole('tab', { name: 'Alle' }))
        testVisibility({page: page, data: oldData, isVisible: false})
        testVisibility({page: page, data: newData, isVisible: true})
        
        await editButton.click()
        fillForm(oldData)

        testVisibility({page: page, data: oldData, isVisible: true})
        testVisibility({page: page, data: newData, isVisible: false})
        await navClick(page.getByRole('tab', { name: 'Repertoar' }))
        testVisibility({page: page, data: oldData, isVisible: true})
        testVisibility({page: page, data: newData, isVisible: false})
    })

   async function testVisibility({page, data, isVisible}: { page: Page, data: TitleData, isVisible: boolean}) {
        if (isVisible) {
            await expect(page.getByText(data.title)).toBeVisible()
            await expect(page.getByText(data.extraInfo)).toBeVisible()
        } else {
            await expect(page.getByText(data.title)).not.toBeVisible()
            await expect(page.getByText(data.extraInfo)).not.toBeVisible()
        }
   }
    // async function FillForm(data: ) {
        
    // }
}
