import { Locator } from "@playwright/test";

export async function navClick(locator: Locator) {
    await Promise.all([
        locator.page().waitForNavigation({waitUntil: "networkidle"}),
        locator.click()
    ])
}