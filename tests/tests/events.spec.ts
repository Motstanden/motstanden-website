import { expect, Page, test } from '@playwright/test';
import { ParticipationStatus, UserGroup } from 'common/enums';
import { NewEventData as NewEventApiData } from 'common/interfaces';
import dayjs from "common/lib/dayjs";
import { formatDateTimeInterval } from "common/utils/dateTime";
import { randomInt, randomUUID } from 'crypto';
import { disposeStorageLogIn, getStoragePath, getUserFullName, storageLogIn } from '../utils/auth';
import { selectDate } from '../utils/datePicker';
import { navClick } from '../utils/navClick';

test.describe("Contributor can update and delete events they have created", async () => {
    await testCrud({
        creator: UserGroup.Contributor,
        testId: 1
		
    })
})

test.describe("Admin can update and delete events other have created @smoke", async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		updater: UserGroup.Administrator,
		testId: 2
	})
})

test.describe("Super admin can update and delete events other have created", async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		updater: UserGroup.SuperAdministrator,
		testId: 3
	})
})

test.describe("Contributors can update other events", async () => {
    await testCrud({
		creator: UserGroup.Editor,
		updater: UserGroup.Contributor,
        deleter: UserGroup.Editor,
		testId: 4
	})
})

test.describe("Event participation @smoke", async () => {

    const event: NewEventData = createRandomEvent()
	let eventUrl: string
	const testUser = UserGroup.Contributor
	
	test.use({storageState: getStoragePath(testUser)})
	
	// Setup: Create a new event
	test.beforeAll( async ({browser}) => {
		const _page = await storageLogIn(browser, UserGroup.SuperAdministrator)
		await testCreateNew(_page, event)
		eventUrl = _page.url()
		await disposeStorageLogIn(_page)
	})

	// Clean up: Delete the event that was created in the setup
	test.afterAll( async ({browser}) => {
		const _page = await storageLogIn(browser, UserGroup.Administrator)
    	await testDelete(_page, event)
		await disposeStorageLogIn(_page)
	})

	function statusToString(status: ParticipationStatus): string {
		if(status === ParticipationStatus.Unknown)
			return "——————";
		return status.toString()
	}

	async function selectItem(page: Page, status: ParticipationStatus) {
  		const selectButton = page.getByRole('button', { name: /Min status/ })
		await selectButton.click()

		const option = page.getByRole('option', { name: statusToString(status), exact: true})
		await Promise.all([
			option.click(),
			option.waitFor({state: "detached"})
		])
		await page.waitForLoadState("networkidle")

		// Wait for button to be enabled. Timeout after 10 seconds
		let waitForEnable = true
		setTimeout(() => waitForEnable = false, 10000);
		while(waitForEnable && !(await selectButton.isEnabled())) { }
	}

	test("Users can participate on events", async ({page}) => {
		page.goto(eventUrl)

		const attendHeading = page.getByRole('heading', { name: statusToString(ParticipationStatus.Attending), exact: true })
		const maybeHeading = page.getByRole('heading', { name: statusToString(ParticipationStatus.Maybe), exact: true })
		const notAttendingHeading = page.getByRole('heading', { name: statusToString(ParticipationStatus.NotAttending), exact: true})

		const userLink = page.getByRole('link', { name: getUserFullName(testUser) })

		selectItem(page, ParticipationStatus.Attending)
		await expect(userLink).toBeVisible();
		await expect(attendHeading).toBeVisible();
		await expect(maybeHeading).not.toBeVisible();
		await expect(notAttendingHeading).not.toBeVisible();

		selectItem(page, ParticipationStatus.Maybe)
		await expect(userLink).toBeVisible();
		await expect(attendHeading).not.toBeVisible();
		await expect(maybeHeading).toBeVisible();
		await expect(notAttendingHeading).not.toBeVisible();

		selectItem(page, ParticipationStatus.NotAttending)
		await expect(userLink).toBeVisible();
		await expect(attendHeading).not.toBeVisible();
		await expect(maybeHeading).not.toBeVisible();
		await expect(notAttendingHeading).toBeVisible();

		selectItem(page, ParticipationStatus.Unknown)
		await expect(userLink).not.toBeVisible();
		await expect(attendHeading).not.toBeVisible();
		await expect(maybeHeading).not.toBeVisible();
		await expect(notAttendingHeading).not.toBeVisible();
	})
})

interface NewEventData extends Omit<NewEventApiData, "description" | "descriptionHtml"> {
	description: string
}

// crud -> create read update delete
interface CrudOptions {
    creator: UserGroup,
    updater?: UserGroup,
    deleter?: UserGroup,
    testId: number
}	

async function testCrud(opts: CrudOptions) {

	test.describe.configure({mode: 'serial'})

	opts.updater ??= opts.creator
    opts.deleter ??= opts.updater

    const event1: NewEventData = createRandomEvent()
	const event2: NewEventData = createRandomEvent()

	test(`New (${opts.testId})`, async ({browser}) => {
		const page = await storageLogIn(browser, opts.creator)
    	await testCreateNew(page, event1)
		await disposeStorageLogIn(page)
	})

	test(`Update (${opts.testId})`, async ({browser}) => {
		const page = await storageLogIn(browser, opts.updater)
    	await testUpdate(page, event1, event2)
		await disposeStorageLogIn(page)
	})

	test(`Delete (${opts.testId})`, async ({browser}) => {
		const page = await storageLogIn(browser, opts.deleter)
    	await testDelete(page, event2)
		await disposeStorageLogIn(page)
	})
}

function createRandomEvent(): NewEventData {

	const start = dayjs().add(randomInt(1, 100), "day")
						 .add(randomInt(1, 100), "hour")
						 .add(randomInt(0, 59), "minute");

	const end = dayjs(start).add(randomInt(1, 100), "hour")
							.add(randomInt(0, 59), "minute");

	const event: NewEventData = {
        title: randomString("title"),
        startDateTime: start.format("YYYY-MM.DD HH:mm:ss"),
        endDateTime: randomBool() ? end.format("YYYY-MM.DD HH:mm:ss") : null,
        keyInfo: [],
		description: randomString("description")
    }
    
	const keyInfoCount = randomInt(0, 3)
	for(let i = 0; i < keyInfoCount; i++) {
		event.keyInfo.push({ 
			key: randomString("key", 16 /*max characters*/ ),
			value: randomString("value")
		})
	}

	return event
}

function randomString(name: string, maxChars?: number) {
	let value = `${name} id: ${randomUUID()}`
	if(maxChars) {
		value = value.slice(Math.max(0, value.length - maxChars)) 	// Prioritize end of string
	}
	return value
}

function randomBool(){
	return Math.random() < 0.5;
}

async function testCreateNew(page: Page, event: NewEventData) {
	await page.goto("/arrangement/ny")
	await submitForm(page, event)
	await validateEventPage(page, event)
}

async function testUpdate(page: Page, oldEvent: NewEventData, newEvent: NewEventData) {
	await page.goto(getBaseUrl(oldEvent))
	await page.getByRole('link', { name: oldEvent.title }).click()	
	await clickMenuItem(page, "Rediger")

	await submitForm(page, newEvent)
	await validateEventPage(page, newEvent)

	// Test that key info from the old event is gone
	for(let i = 0; i < oldEvent.keyInfo.length; i++) {
		await expect(page.getByText(oldEvent.keyInfo[i].key)).not.toBeVisible()
		await expect(page.getByText(oldEvent.keyInfo[i].value)).not.toBeVisible()
	}
}

async function testDelete(page: Page, event: NewEventData) {
	const baseUrl = getBaseUrl(event)
	await page.goto(baseUrl)
	await page.getByRole('link', { name: event.title }).click()	

	await clickMenuItem(page, "Slett")

	await expect(page.getByRole('link', { name: event.title })).not.toBeVisible()
}

async function submitForm(page: Page, event: NewEventData) {
	await fillForm(page, event)
	await saveForm(page)
}

async function fillForm(page: Page, event: NewEventData) {
	await page.getByPlaceholder('Tittel på arrangement*').fill(event.title);
	await selectDate(page, /Starter/, event.startDateTime, "TimeDayMonthYear")
	await selectDate(page, /Slutter/, event.endDateTime, "TimeDayMonthYear")
	
	// Remove old key info items if they exists
	const buttons = page.getByRole('button', { name: 'Fjern nøkkelinformasjon' })
	while(await buttons.first().isVisible()) {
		await buttons.last().click()
	}

	// Add new key info items
	for(let i = 0; i < event.keyInfo.length; i++) {
		await page.getByRole('button', { name: 'Nøkkelinformasjon', exact: true }).click();
		await page.getByPlaceholder('Tittel*').nth(i).fill(event.keyInfo[i].key);
		await page.getByPlaceholder('info*').nth(i).fill(event.keyInfo[i].value);
	}

	const editor = page.getByTestId('event-description-editor') 
	await editor.click()	// This circumvents a bug in the front end. See https://github.com/Motstanden/motstanden-website/issues/86
	await editor.fill(event.description)
}

async function saveForm(page: Page) {
	const saveButton = page.getByRole('button', { name: 'Lagre' })
	await navClick(saveButton)
}

async function validateEventPage(page: Page, event: NewEventData) {
	const urlRegExp = isUpcoming(event) 
		? /\/arrangement\/kommende\/[0-9]+/ 
		: /\/arrangement\/tidligere\/[0-9]+/ 
	await expect(page).toHaveURL(urlRegExp)

	await expect(page.getByText(event.title)).toBeVisible()
	await expect(page.getByText(event.description)).toBeVisible()	

	const timeText = formatDateTimeInterval(event.startDateTime, event.endDateTime)
	await expect(page.getByText(timeText)).toBeVisible()	

	for(let i = 0; i < event.keyInfo.length; i++) {
		await expect(page.getByText(event.keyInfo[i].key)).toBeVisible()
		await expect(page.getByText(event.keyInfo[i].value)).toBeVisible()
	}
}

async function clickMenuItem(page: Page, menuItem: "Rediger" | "Slett") {
	
	const menuButton = page.getByRole('button', { name: 'Arrangementmeny' })
	const isPopupMenu = await menuButton.isVisible()
	if(isPopupMenu){
		await menuButton.click()
	}

	const itemButton = page.getByRole(isPopupMenu ? 'menuitem' : 'button', { name: menuItem })

	if(menuItem === "Slett") {
		page.once('dialog', dialog => dialog.accept());
		await itemButton.click();
	} 

	if(menuItem === "Rediger") {
		await navClick(itemButton)
	}
}

function isUpcoming(event: NewEventData) {
	return dayjs(event.startDateTime).isAfter(dayjs())	
}

function getBaseUrl(event: NewEventData) {
	return isUpcoming(event)
		? "/arrangement/kommende" 
		: "/arrangement/tidligere"
}