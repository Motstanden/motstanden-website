import { Locator, Page, expect, test } from "@playwright/test"
import { UserGroup } from "common/enums"
import { logIn } from "../../utils/auth.js"
import { randomString } from "../../utils/randomString.js"

test.describe("Editor can update simple texts", () => {
    
    runTests({
        url: "/framside"
    })

    runTests({
        url: "/bli-medlem"
    })

    runTests({
        url: "/faq"
    })

    runTests({
        url: "/historie"
    })

    runTests({ 
        url: "/styrets-nettsider",
        title: "/styrets-nettsider 1",
        menuButtonLocator: (page: Page) => page.getByLabel("Tekstmeny").nth(0)
    })

    runTests({
        url: "/styrets-nettsider",
        title: "/styrets-nettsider 2",
        menuButtonLocator: (page: Page) => page.getByLabel("Tekstmeny").nth(1)
    })

    interface TestOptions {
        url: string,
        title?: string
        menuButtonLocator?: (page: Page) => Locator
    }

    function runTests({
        url,
        title,
        menuButtonLocator = (page: Page) => page.getByLabel("Tekstmeny")
    }: TestOptions) {

        const testName = title ?? url
        test(testName, async ({browser}, workerInfo) => {
            const { page } = await logIn(browser, workerInfo, UserGroup.Editor)
            
            await page.goto(url)

            await startEdit(page)

            const editForm = page.getByPlaceholder('Skriv inn tekst her...')
            const originalText = await editForm.inputValue()
            const newText = randomString("Update simple text test: ")

            // Update text
            await editForm.fill(newText)
            await clickSave(page)

            // Assert update
            await expect(page.getByText(newText)).toBeVisible()

            // Clean up
            await startEdit(page)
            await editForm.fill(originalText)
            await clickSave(page)

            // Assert clean up
            await expect(page.getByText(newText)).not.toBeVisible()
        })
        
    async function startEdit(page: Page) { 
        const menuButton = menuButtonLocator(page)
        await menuButton.click()
        await clickEdit(page)
    }
}})

async function clickEdit(page: Page) {
    const button = page.getByRole("menuitem", {name: "Rediger"})
    await Promise.all([
        button.click(),
        button.waitFor({state: "detached"})
    ])
}

async function clickSave(page: Page) {
    const button = page.getByRole("button", { name: 'Lagre', exact: true })
    await Promise.all([
        button.click(),
        button.waitFor({state: "detached"})
    ])
}