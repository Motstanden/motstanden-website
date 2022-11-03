import { expect, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { NewQuote } from "common/interfaces";
import { randomUUID } from "crypto";
import { getStoragePath } from '../utils/auth';
import { navClick } from '../utils/navClick';


test.use({ storageState: getStoragePath(UserGroup.Contributor)})

test.describe.serial("Quotes can be created, updated and deleted",  async () => {

    // Mockup data for the tests
    const newQuote: NewQuote = createRandomQuote()
    const editedQuote: NewQuote = createRandomQuote()

    test("New quote", async ({page}) => {
        await page.goto('/sitater/ny');
        await page.getByLabel('Sitat *').fill(newQuote.quote);
        await page.getByLabel('Sitatytrer *').fill(newQuote.utterer);
    
        await navClick(page.getByRole('button', { name: 'Lagre' }))
        await expect(page).toHaveURL('/sitater');
    
        await expect(page.getByText(newQuote.quote)).toBeVisible();
        await expect(page.getByText(newQuote.utterer)).toBeVisible();
    })

    test("Update quote", async ({page}) => {
        await page.goto('/sitater');
        await page.locator(`li:has-text("${newQuote.quote}")`).getByRole('button').click();

        await page.getByRole('menuitem', { name: 'Rediger' }).click();
      
        await page.getByLabel('Sitat *').fill(editedQuote.quote);
        await page.getByLabel('Sitatytrer *').fill(editedQuote.utterer);
      
        await page.getByRole('button', { name: 'Lagre' }).click();
      
        await expect(page.getByText(editedQuote.quote)).toBeVisible();
        await expect(page.getByText(editedQuote.utterer)).toBeVisible();
        await expect(page.getByText(newQuote.quote)).not.toBeVisible();
        await expect(page.getByText(newQuote.utterer)).not.toBeVisible();
    })

    test("Delete quote", async ({page}) => {
        await page.goto('/sitater');

        page.on('dialog', dialog => dialog.accept());

        await page.locator(`li:has-text("${editedQuote.quote}")`).getByRole('button').click();
        await page.getByRole('menuitem', { name: 'Slett' }).click();
      
        await expect(page.getByText(editedQuote.quote)).not.toBeVisible();
        await expect(page.getByText(editedQuote.utterer)).not.toBeVisible();
    })
})

function createRandomQuote(): NewQuote {
    return {
        utterer: `__test utterer id: ${randomUUID()}`, 
        quote: `__test quote id: ${randomUUID()}`     
    }
}