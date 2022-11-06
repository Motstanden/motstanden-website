import { Page } from '@playwright/test';
import { navClick } from '../utils/navClick';


export abstract class EditListPage<T> {

	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	protected abstract fillForm(value: T): Promise<void>;

	protected abstract openMenu(value: T): Promise<void>;

	private getSaveButton() {
		return this.page.getByRole('button', { name: 'Lagre' });
	}

	async newItem(value: T): Promise<void> {
		this.fillForm(value);
		await navClick(this.getSaveButton());
	}

	private async clickMenuItem(menuItem: "Rediger" | "Slett", value: T) {
		await this.openMenu(value);
		await this.page.getByRole('menuitem', { name: menuItem }).click();
	}

	async editItem(oldValue: T, newValue: T) {
		await this.clickMenuItem("Rediger", oldValue);
		await this.fillForm(newValue);
		await Promise.all([
			this.getSaveButton().click(),
			this.getSaveButton().waitFor({ state: "detached" })
		]);
	}

	async deleteItem(value: T) {
		this.page.once('dialog', dialog => dialog.accept());
		await this.clickMenuItem("Slett", value);
	}
}
