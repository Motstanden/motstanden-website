import { test, expect } from '@playwright/test';
import { Quote, NewQuote } from "common/interfaces"
import { randomUUID } from "crypto"

test('Quotes can be created, updated and deleted', async ({ page }) => {

    // log in
    await page.goto('/logg-inn');

    await page.getByLabel('E-post *').click();

    await page.getByLabel('E-post *').fill('web@motstanden.no');

    await page.getByRole('button', { name: 'Dev logg inn' }).click();
    await expect(page).toHaveURL('/hjem');


    await page.goto('/sitater/ny');

    // Test if quote can be inserted
    const newQuote: NewQuote = { 
        utterer: `utterer id: ${randomUUID()}`, 
        quote: `quote id: ${randomUUID()}` 
    }
    
    await page.getByLabel('Sitat *').click();
    await page.getByLabel('Sitat *').fill(newQuote.quote);

    await page.getByLabel('Sitatytrer *').click();
    await page.getByLabel('Sitatytrer *').fill(newQuote.utterer);

    await page.getByRole('button', { name: 'Lagre' }).click();
    await expect(page).toHaveURL('/sitater');

    await expect(page.getByText(newQuote.quote)).toBeVisible();
    await expect(page.getByText(newQuote.utterer)).toBeVisible();


    // Test if quote can be edited
    const editedQuote: NewQuote = { 
        utterer: `utterer id: ${randomUUID()}`, 
        quote: `quote id: ${randomUUID()}` 
    }

    await page.locator(`li:has-text("${newQuote.quote}")`).getByRole('button').click();

    await page.getByRole('menuitem', { name: 'Rediger' }).click();
  
    await page.getByLabel('Sitat *').click();
    await page.getByLabel('Sitat *').fill(editedQuote.quote);
  
    await page.getByLabel('Sitatytrer *').click();
    await page.getByLabel('Sitatytrer *').fill(editedQuote.utterer);
  
    await page.getByRole('button', { name: 'Lagre' }).click();
  
    await expect(page.getByText(editedQuote.quote)).toBeVisible();
    await expect(page.getByText(editedQuote.utterer)).toBeVisible();

    await page.locator(`li:has-text("${editedQuote.quote}")`).getByRole('button').click();

    // Delete quote
    page.on('dialog', dialog => dialog.accept());

    await page.getByRole('menuitem', { name: 'Slett' }).click();
  
    await expect(page.getByText(editedQuote.quote)).not.toBeVisible();
    await expect(page.getByText(editedQuote.utterer)).not.toBeVisible();

});