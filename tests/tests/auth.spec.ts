import { expect, type Page } from '@playwright/test';
import { UserGroup } from 'common/enums';

export async function logIn(page: Page, group: UserGroup) {
    await page.goto('/logg-inn');
    
    const user = getUserEmail(group)
    await page.getByLabel('E-post *').click();    
    await page.getByLabel('E-post *').fill(user);

    await page.getByRole('button', { name: 'Dev logg inn' }).click();
    await expect(page).toHaveURL('/hjem');
} 

export function getUserEmail(group: UserGroup): string {
    switch (group) {
        case UserGroup.Contributor: return "contributor@motstanden.no"
        case UserGroup.Editor: return "editor@motstanden.no"
        case UserGroup.Administrator: return "admin@motstanden.no"
        case UserGroup.SuperAdministrator: return "superadmin@motstanden.no"
    }
}