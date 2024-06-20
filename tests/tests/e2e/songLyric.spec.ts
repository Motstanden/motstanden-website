import { Page, expect, test } from '@playwright/test'
import { UserGroup } from 'common/enums'
import { NewSongLyric } from 'common/interfaces'
import { api } from '../../utils/api/index.js'
import { disposeLogIn, logIn } from '../../utils/auth.js'
import { randomString } from '../../utils/randomString.js'

test.describe.serial("Contributor can create, edit and delete authored song lyrics", () => { 

    let page: Page
    let lyric = createRandomData()

    test.beforeAll(async ({browser}, workerInfo) => { 
        const { page: p } = await logIn(browser, workerInfo, UserGroup.Contributor)
        page = p
    })

    test.afterAll(async () => {
        await disposeLogIn(page)
    })

    test("New song lyric", async ({browser}, workerInfo) => { 
        await page.goto("/studenttraller/ny")

        await fillAndSaveForm(page, lyric)

        await expect(page.getByText(lyric.title)).toBeVisible()
        await expect(page.getByText(lyric.content)).toBeVisible()
    })

    test("Edit song lyric", async ({browser}, workerInfo) => { 
        const newLyric = createRandomData()
        await openMenu(page)
        await clickEdit(page, lyric)

        await fillAndSaveForm(page, newLyric)

        await expect(page.getByText(newLyric.title)).toBeVisible()
        await expect(page.getByText(newLyric.content)).toBeVisible()
        await expect(page.getByText(lyric.title)).not.toBeVisible()
        await expect(page.getByText(lyric.content)).not.toBeVisible()

        lyric = newLyric
    })

    test("Delete song lyric", async () => { 
        await testDeleteSongLyric(page, lyric)
    })
})

test.describe("Admin can delete all song lyrics", () => {

    const lyric = createRandomData()

    test.beforeAll(async ({browser}, workerInfo) => { 
        const { page } = await logIn(browser, workerInfo, UserGroup.Contributor)
        await api.songLyrics.new(page.request, lyric)     // Significantly faster than creating through UI
        await disposeLogIn(page)
    })

    test("Delete song lyric", async ({browser}, workerInfo) => {
        const { page } = await logIn(browser, workerInfo, UserGroup.Administrator)

        const url = buildUrl(lyric)
        await page.goto(url)
        expect(page.url()).toMatch(url)

        await testDeleteSongLyric(page, lyric)
        
        await disposeLogIn(page)
    })
})

async function testDeleteSongLyric(page: Page, songLyric: NewSongLyric) { 
    await openMenu(page)
    await clickDelete(page, songLyric)
    await clickAllSongsTab(page)
    await expect(page.getByText(songLyric.title)).not.toBeVisible()
}

async function fillAndSaveForm(page: Page, songLyric: NewSongLyric) {
    await fillForm(page, songLyric)
    await clickSave(page, songLyric)
}

async function fillForm(page: Page, songLyric: NewSongLyric) {
    await page.getByLabel('Tittel *').fill(songLyric.title)
    await page.getByRole("checkbox", { name: "Populær" }).setChecked(songLyric.isPopular)
    await page.getByPlaceholder('Skriv inn trallen her...').fill(songLyric.content)   
}

async function clickSave(page: Page, songLyric: NewSongLyric) { 
    const expectedUrl = buildUrl(songLyric)
    await Promise.all([
        page.getByRole('button', { name: 'Lagre' }).click(),
        page.waitForURL(expectedUrl)
    ])
}

async function openMenu(page: Page) {
    await page.getByLabel('Trallmeny').click()
}

async function clickEdit(page: Page, songLyric: NewSongLyric) { 
    const expectedUrl = `${buildUrl(songLyric)}/rediger`
    await Promise.all([
        page.getByRole("menuitem", { name: "Rediger" }).click(),
        page.waitForURL(expectedUrl)
    ])
}

async function clickDelete(page: Page, songLyric: NewSongLyric) { 
    const expectedUrl = `/studenttraller/${songLyric.isPopular ? "populaere" : "alle"}`
    page.once('dialog', dialog => dialog.accept());
    await Promise.all([
        page.getByRole("menuitem", { name: "Slett" }).click(),
        page.waitForURL(new RegExp(expectedUrl)),
    ])
}

async function clickAllSongsTab(page: Page) {
    const expectedUrl = "/studenttraller/alle"
    const isAllPage = page.url().toLowerCase().includes(expectedUrl)
    if(!isAllPage) {
        await Promise.all([
            page.getByRole("tab", { name: "Alle" }).click(),
            page.waitForURL(new RegExp(expectedUrl))
        ])
    }
}

function buildUrl( lyric: NewSongLyric) {
    const title = lyric.title
        .replace(/ /g, "-")
        .replace(/æ/g, "ae")
        .replace(/ø/g, "oe")
        .replace(/å/g, "aa")
        .toLowerCase()
    const categoryPath = lyric.isPopular ? "populaere" : "alle"
    return `/studenttraller/${categoryPath}/${title}`
}

function createRandomData(data?: NewSongLyric): NewSongLyric {
    return {
        title: randomString("Title"),
        content: randomString("Content"),
        isPopular: true,
        ...data
    }
} 