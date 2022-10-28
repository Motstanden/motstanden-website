import { chromium, FullConfig } from "@playwright/test";
import { UserGroup } from "common/enums";
import { getStoragePath, logIn } from "./utils/auth";

export default async function globalSetup(config: FullConfig) {
    await authSetup()
}

async function authSetup() {
    const browser = await chromium.launch()
    const groups: UserGroup[] = Object.values(UserGroup)

    for(let i = 0; i < groups.length; i++) {
        const group = groups[i]
        const page = await browser.newPage(); 
        await logIn(page, group)
        await page.context().storageState({ path: getStoragePath(group) })
    }

    await browser.close()
}