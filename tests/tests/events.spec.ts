import { expect, Page, test } from '@playwright/test';
import { ParticipationStatus, UserGroup } from 'common/enums';
import { NewEventData as NewEventApiData } from 'common/interfaces';
import dayjs from "common/lib/dayjs";
import { getFullName } from 'common/utils';
import { formatDateTimeInterval } from "common/utils/dateTime";
import { randomInt, randomUUID } from 'crypto';
import { disposeStorageLogIn, getUser, storageLogIn } from '../utils/auth';
import { selectDate } from '../utils/datePicker';
import { navClick } from '../utils/navClick';

test.describe("Contributor can update and delete events they have created", async () => {
    await testCrud({
        creator: UserGroup.Contributor,
        testId: 1
		
    })
})

test.describe("Admin can update and delete events other have created", async () => {
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

test.describe("Contributors can update other events @smoke", async () => {
    await testCrud({
		creator: UserGroup.Editor,
		participator: UserGroup.Contributor,
		updater: UserGroup.Contributor,
        deleter: UserGroup.Administrator,
		testId: 4
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
	participator?: UserGroup,
    testId: number
}	

async function testCrud(opts: CrudOptions) {

	test.describe.configure({mode: 'serial'})
	test.slow()

	opts.updater ??= opts.creator
    opts.deleter ??= opts.updater
	const runParticipationTest = !!opts.participator

    const event1: NewEventData = createRandomEvent()
	const event2: NewEventData = createRandomEvent()

	let eventUrl: string
	let page: Page

	test(`New (${opts.testId})`, async ({browser}) => {
		page = await storageLogIn(browser, opts.creator)
		await page.goto("/arrangement/ny")

		await testCreateNew(page, event1)

		eventUrl = page.url()

		if(runParticipationTest || opts.creator !== opts.updater) {
			await disposeStorageLogIn(page)
		}
	})

	test(`User can participate on events (${opts.testId})`, async ({browser}) => {
		if(!opts.participator)
			test.skip()
			
		if(opts.participator === opts.creator) 
			throw "Invalid operation: participator can creator can not be the same user";

		page = await storageLogIn(browser, opts.participator)
		await page.goto(eventUrl)
		await testParticipation(page, opts.participator)

		if(opts.updater !== opts.participator) {
			await disposeStorageLogIn(page)
		}
	})

	test(`Update (${opts.testId})`, async ({browser}) => {

		const reusePage = opts.creator === opts.updater || (runParticipationTest && opts.updater === opts.participator) 
		if(!reusePage) {
			page = await storageLogIn(browser, opts.updater)
			await page.goto(eventUrl)
		}

    	await testUpdate(page, event1, event2)

		if(opts.updater !== opts.deleter) {
			await disposeStorageLogIn(page)
		}
	})

	test(`Delete (${opts.testId})`, async ({browser}) => {
		const reusePage = opts.updater === opts.deleter
		if(!reusePage) {
			page = await storageLogIn(browser, opts.deleter)
			await page.goto(eventUrl)
		}
		
    	await testDelete(page, event2)
		await disposeStorageLogIn(page)
	})
}

async function testParticipation(page: Page,  userGroup: UserGroup) {

	const userFullName = getFullName(getUser(userGroup))
	const userLink = page.getByRole('link', { name: userFullName })

	const attendHeading = page.getByRole('heading', { name: statusToString(ParticipationStatus.Attending), exact: true })
	const maybeHeading = page.getByRole('heading', { name: statusToString(ParticipationStatus.Maybe), exact: true })
	const notAttendingHeading = page.getByRole('heading', { name: statusToString(ParticipationStatus.NotAttending), exact: true})

	await selectStatusItem(page, ParticipationStatus.Attending)
	await expect(userLink).toBeVisible();
	await expect(attendHeading).toBeVisible();
	await expect(maybeHeading).not.toBeVisible();
	await expect(notAttendingHeading).not.toBeVisible();

	await selectStatusItem(page, ParticipationStatus.Maybe)
	await expect(userLink).toBeVisible();
	await expect(attendHeading).not.toBeVisible();
	await expect(maybeHeading).toBeVisible();
	await expect(notAttendingHeading).not.toBeVisible();

	await selectStatusItem(page, ParticipationStatus.NotAttending)
	await expect(userLink).toBeVisible();
	await expect(attendHeading).not.toBeVisible();
	await expect(maybeHeading).not.toBeVisible();
	await expect(notAttendingHeading).toBeVisible();

	await selectStatusItem(page, ParticipationStatus.Unknown)
	await expect(userLink).not.toBeVisible();
	await expect(attendHeading).not.toBeVisible();
	await expect(maybeHeading).not.toBeVisible();
	await expect(notAttendingHeading).not.toBeVisible();
}

async function testCreateNew(page: Page, event: NewEventData) {
	await submitForm(page, event)
	await validateEventPage(page, event)
}

async function testUpdate(page: Page, oldEvent: NewEventData, newEvent: NewEventData) {
	await clickEdit(page)

	await submitForm(page, newEvent)
	await validateEventPage(page, newEvent)

	// Test that key info from the old event is gone
	for(let i = 0; i < oldEvent.keyInfo.length; i++) {
		await expect(page.getByText(oldEvent.keyInfo[i].key)).not.toBeVisible()
		await expect(page.getByText(oldEvent.keyInfo[i].value)).not.toBeVisible()
	}
}

async function testDelete(page: Page, event: NewEventData) {
	await clickDelete(page)
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

async function clickDelete(page: Page) {
	await page.getByRole('button', { name: 'Arrangementmeny' }).click();
	page.once('dialog', dialog => dialog.accept());
	await  page.getByRole('menuitem', { name: "Slett" }).click();
}

async function clickEdit(page: Page) {
	const menuButton = page.getByRole('button', { name: 'Arrangementmeny' })
	const editButton = page.getByRole('button', { name: "Rediger" })

	await Promise.race([
		menuButton.click(),
		navClick(editButton)
	])

	const editMenuItem = await page.getByRole('menuitem', { name: "Rediger" })
	const isPopupMenu = await editMenuItem.isVisible()
	if(isPopupMenu){
		await  navClick(editMenuItem)
	}	
}
async function selectStatusItem(page: Page, status: ParticipationStatus) {
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
	while(waitForEnable && !(await selectButton.isEnabled())) {
		await page.waitForTimeout(200)
	}
}

function statusToString(status: ParticipationStatus): string {
	if(status === ParticipationStatus.Unknown)
		return "——————";
	return status.toString()
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
function isUpcoming(event: NewEventData) {
	const now = dayjs()
	
	if(event.endDateTime) 
		return dayjs(event.endDateTime).add(3, "hour").isAfter(now);

	return dayjs(event.startDateTime).endOf("day").add(6, "hour").isAfter(now)	
}