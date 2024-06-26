import { APIRequestContext, Page, expect, test } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { NewPollWithOption, Poll } from 'common/interfaces'
import { disposeLogIn, logIn } from '../../utils/auth.js'
import { randomString } from '../../utils/randomString.js'

test.describe.configure({ mode: "serial"})

test.describe("Contributor can create, vote on- and delete polls they have created", async () => {
    runTests({
        creator: UserGroup.Contributor,
        deleter: UserGroup.Contributor,
        testId: 1
    })
})

test.describe("Admin can delete all polls", async () => {
    runTests({
        creator: UserGroup.Contributor,
        deleter: UserGroup.Administrator,
        testId: 2
    })
})

interface TestOptions {
    creator: UserGroup,
    deleter: UserGroup,
    testId: number
}

function runTests(opts: TestOptions) {
    const poll = createPoll()
    const { creator, deleter } = opts

    test.describe.configure({ mode: "serial"})

    test(`New ${opts.testId}`, async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, creator) 
        await page.goto("/avstemninger/ny")

        await fillForm(page, poll)
        await saveForm(page)
        
        await clickAllPollsTab(page)
        await expandPollItem(page, poll)

        await validatePoll(page, poll)

        await disposeLogIn(page)
    })

    test(`Vote ${opts.testId}`, async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, creator)

        // Todo

        await disposeLogIn(page)
    })

    test(`Delete ${opts.testId}`, async ({browser}, workerInfo) => {
        const { page } = await logIn(browser, workerInfo, deleter)

        const pollUrl = await getPollUrl(page.request, poll)
        await page.goto(pollUrl)

        await clickDelete(page)

        const title = page.getByRole('heading', { name: poll.title })
        await expect(title).not.toBeVisible()
    
        await disposeLogIn(page)
    })
}

async function fillForm(page: Page, poll: NewPollWithOption) {
    // Polls are hard coded to have 4 single choice options
    // because I did not want to make the test more complex than it needs to be.
    // You may consider to make the test more dynamic.
    expect(poll.options.length, "Should have exactly 4 options").toBe(4)
    expect(poll.type, "Should be single choice").toBe("single")

    // We expect the form to have 3 options by default.
    // This should add the 4th option.
    await page.getByRole('button', { name: 'Alternativ' }).click();

    // Fill Title
    await page.getByLabel("Spørsmål *").fill(poll.title)

    // Fill options
    for(let i = 0; i < poll.options.length; i++) { 
        await page.getByLabel(`Alternativ ${i+1} *`).fill(poll.options[i].text)
    }
} 

async function saveForm(page: Page) {
    await page.getByRole('button', { name: 'Lagre' }).click();
    await page.waitForURL("/avstemninger/paagaaende")    
    await expect(page).not.toHaveURL("/avstemninger/ny")
}

async function validatePoll(page: Page, poll: NewPollWithOption) {
    // Title
    const title = page.getByText(poll.title)
    await expect(title).toBeVisible()

    // Validate options
    for(const option of poll.options) {
        const button = page.getByLabel(option.text)
        await expect(button).toBeVisible()
    }
}

async function clickDelete(page: Page) { 
    await page.getByRole("button", {name: "Avstemningmeny"}).click()
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole("menuitem", { name: "Slett" }).click()
}

async function clickAllPollsTab(page: Page) {
    await Promise.all([
        page.getByRole('tab', { name: 'Alle' }).click(),
        page.waitForURL("/avstemninger/alle")
    ])
}

async function expandPollItem(page: Page, poll: NewPollWithOption | Poll) { 
    await getPollListItem(page, poll).click()
}

function getPollListItem(page: Page, poll: NewPollWithOption | Poll) { 
    return page.getByRole('button', { name: poll.title })
}

function createPoll(): NewPollWithOption {
    return {
        title: randomString("Header"),
        type: "single",
        options: [
            { text: randomString("Option A") },
            { text: randomString("Option B") },
            { text: randomString("Option C") },
            { text: randomString("Option D") }
        ]
    }
}

async function getPollUrl(api: APIRequestContext, poll: NewPollWithOption): Promise<string> { 
    const dbPoll = await getPoll(api, poll)
    if(!dbPoll) {
        throw new Error("Poll not found")
    }
    return `/avstemninger/${dbPoll.id}`
}

async function getPoll(api: APIRequestContext, poll: NewPollWithOption): Promise<Poll | undefined> {
    const allPolls = await getAllPolls(api)
    const dbPoll = allPolls.find(p => p.title === poll.title)
    return dbPoll
}

async function getAllPolls(api: APIRequestContext): Promise<Poll[]> {
    const res = await api.get("/api/polls/all")
    if(!res.ok()) {
        throw new Error(`Failed to get all polls.\n${await res.text()}`)
    }
    const data = await res.json() as Poll[]
    return data
}