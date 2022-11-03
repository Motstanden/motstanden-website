import { expect, test } from '@playwright/test';
import { NewRumour } from 'common/interfaces';
import { randomUUID } from "crypto";
import { navClick } from '../utils/navClick';

test.use({ storageState: 'storage-state/contributor.json' });

test.describe.serial("Rumours can be created, updated and deleted", async () => {

	const newRumour: NewRumour = createRandomRumour()
	const editedRumour: NewRumour = createRandomRumour()

	test('New rumour', async ({ page }) => {
    	await page.goto('/rykter/ny');
    	await page.getByLabel('Har du hørt at...? *').fill(newRumour.rumour);

    	await navClick(page.getByRole('button', { name: 'Lagre' }));
    	await expect(page).toHaveURL('/rykter');
		await expect(page.getByText(newRumour.rumour)).toBeVisible();
	})
	
	test("Update rumour", async ({page}) => {
    	await page.goto('/rykter');
        await page.locator(`li:has-text("${newRumour.rumour}")`).getByRole('button').click();

		await page.getByRole('menuitem', { name: 'Rediger' }).click();
		await page.getByLabel('Har du hørt at...? *').fill(editedRumour.rumour);
		await page.getByRole('button', { name: 'Lagre' }).click();

		await expect(page.getByText(editedRumour.rumour)).toBeVisible();
		await expect(page.getByText(newRumour.rumour)).not.toBeVisible();
	})

	test("Delete rumour", async ({page}) => {
    	await page.goto('/rykter');
		await page.locator(`li:has-text("${editedRumour.rumour}")`).getByRole('button').click();

		page.once('dialog', dialog => dialog.accept());
		await page.getByRole('menuitem', { name: 'Slett' }).click();

		await expect(page.getByText(editedRumour.rumour)).not.toBeVisible();
	})
})

function createRandomRumour(): NewRumour {
	return {
		rumour: `__test rumour id: ${randomUUID()}`
	}
}