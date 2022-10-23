import { expect, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { NewQuote } from "common/interfaces";
import { randomUUID } from "crypto";
import { logIn } from './auth.spec';


test("Quotes can be created, updated and deleted", async ({page}) => {
    
    // Mockup data for the tests
    const newQuote: NewQuote = { 
        utterer: `utterer id: ${randomUUID()}`, 
        quote: `quote id: ${randomUUID()}` 
    }
    const editedQuote: NewQuote = { 
        utterer: `utterer id: ${randomUUID()}`, 
        quote: `quote id: ${randomUUID()}` 
    }

    await test.step("Log in", async () => {
        await logIn(page, UserGroup.Contributor)
    })

    await test.step("New quote", async () => {
        await page.goto('/sitater/ny');
        await page.getByLabel('Sitat *').click();
        await page.getByLabel('Sitat *').fill(newQuote.quote);
    
        await page.getByLabel('Sitatytrer *').click();
        await page.getByLabel('Sitatytrer *').fill(newQuote.utterer);
    
        await page.getByRole('button', { name: 'Lagre' }).click();
        await expect(page).toHaveURL('/sitater');
    
        await expect(page.getByText(newQuote.quote)).toBeVisible();
        await expect(page.getByText(newQuote.utterer)).toBeVisible();
    })

    await test.step("Update quote", async () => {
        await page.goto('/sitater');
        await page.locator(`li:has-text("${newQuote.quote}")`).getByRole('button').click();

        await page.getByRole('menuitem', { name: 'Rediger' }).click();
      
        await page.getByLabel('Sitat *').click();
        await page.getByLabel('Sitat *').fill(editedQuote.quote);
      
        await page.getByLabel('Sitatytrer *').click();
        await page.getByLabel('Sitatytrer *').fill(editedQuote.utterer);
      
        await page.getByRole('button', { name: 'Lagre' }).click();
      
        await expect(page.getByText(editedQuote.quote)).toBeVisible();
        await expect(page.getByText(editedQuote.utterer)).toBeVisible();
        await expect(page.getByText(newQuote.quote)).not.toBeVisible();
        await expect(page.getByText(newQuote.utterer)).not.toBeVisible();
    })

    await test.step("Delete quote", async () => {
        await page.goto('/sitater');

        page.on('dialog', dialog => dialog.accept());

        await page.locator(`li:has-text("${editedQuote.quote}")`).getByRole('button').click();
        
        await page.getByRole('menuitem', { name: 'Slett' }).click();
      
        await expect(page.getByText(editedQuote.quote)).not.toBeVisible();
        await expect(page.getByText(editedQuote.utterer)).not.toBeVisible();
    })
})