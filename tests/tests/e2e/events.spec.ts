import { expect, Page, test } from '@playwright/test'
import { ParticipationStatus, UserGroup } from 'common/enums'
import { NewEventData } from 'common/interfaces'
import { getFullName } from 'common/utils'
import { formatDateTimeInterval } from "common/utils/dateTime"
import { randomInt } from 'crypto'
import dayjs from "../../lib/dayjs.js"
import { disposeLogIn, logIn, TestUser } from '../../utils/auth.js'
import { selectDate } from '../../utils/datePicker.js'
import { randomString } from '../../utils/randomString.js'

test.describe("Contributor can update and delete events they have created", async () => {
    testCrud({
        creator: UserGroup.Contributor,
        testId: 1
    })
})

test.describe("Admin can update and delete events other have created", async () => {
	testCrud({
		creator: UserGroup.Contributor,
		updater: UserGroup.Administrator,
		testId: 2
	})
})

test.describe("Super admin can update and delete events other have created", async () => {
	testCrud({
		creator: UserGroup.Contributor,
		updater: UserGroup.SuperAdministrator,
		testId: 3
	})
})

test.describe("Contributors can update other events @smoke", async () => {
    testCrud({
		creator: UserGroup.Editor,
		participator: UserGroup.Contributor,
		updater: UserGroup.Contributor,
        deleter: UserGroup.Administrator,
		testId: 4
	})
})

interface TestEvent extends NewEventData {
	startDate: dayjs.Dayjs,
	endDate?: dayjs.Dayjs
}

// crud -> create read update delete
interface CrudOptions {
    creator: UserGroup,
    updater?: UserGroup,
    deleter?: UserGroup,
	participator?: UserGroup,
    testId: number
}	

function testCrud(opts: CrudOptions) {

	test.describe.configure({mode: 'serial'})
	test.slow()

	const { participator } = opts
	const updater = opts.updater ?? opts.creator
	const deleter = opts.deleter ?? updater

    const event1: TestEvent = createRandomEvent()
	const event2: TestEvent = createRandomEvent()

	let eventUrl: string

	test(`New (${opts.testId})`, async ({browser}, workerInfo) => {
		
		const { page } = await logIn(browser, workerInfo, opts.creator)
		await page.goto("/arrangement/ny")

		await testCreateNew(page, event1)

		eventUrl = page.url()

		await disposeLogIn(page)
	})

	if(participator !== undefined) {
		test(`User can participate on events (${opts.testId})`, async ({browser}, workerInfo) => {

			if(opts.participator === opts.creator) 
				throw "Invalid operation: participator and creator can not be the same user";

			const { page, user } = await logIn(browser, workerInfo, participator)
			await page.goto(eventUrl)

			await testParticipation(page, user)

			await disposeLogIn(page)
		})
	}

	test(`Update (${opts.testId})`, async ({browser}, workerInfo) => {

		const { page } = await logIn(browser, workerInfo, updater)
		await page.goto(eventUrl)

    	await testUpdate(page, event1, event2)

		await disposeLogIn(page)
	})

	test(`Delete (${opts.testId})`, async ({browser}, workerInfo) => {

		const { page } = await logIn(browser, workerInfo, deleter)
		await page.goto(eventUrl)
		
    	await testDelete(page, event2)

		await disposeLogIn(page)
	})
}

async function testParticipation(page: Page,  user: TestUser) {

	const userFullName = getFullName(user)
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

async function testCreateNew(page: Page, event: TestEvent) {
	await submitForm(page, event)
	await validateEventPage(page, event)
}

async function testUpdate(page: Page, oldEvent: TestEvent, newEvent: TestEvent) {
	await clickEdit(page)

	await submitForm(page, newEvent)
	await validateEventPage(page, newEvent)

	// Test that key info from the old event is gone
	for(let i = 0; i < oldEvent.keyInfo.length; i++) {
		await expect(page.getByText(oldEvent.keyInfo[i].key)).not.toBeVisible()
		await expect(page.getByText(oldEvent.keyInfo[i].value)).not.toBeVisible()
	}
}

async function testDelete(page: Page, event: TestEvent) {
	await clickDelete(page)
	await expect(page.getByText(event.title)).not.toBeVisible()
}

async function submitForm(page: Page, event: TestEvent) {
	await fillForm(page, event)
	await saveForm(page)
}

async function fillForm(page: Page, event: TestEvent) {
	await page.getByPlaceholder('Tittel på arrangement *').fill(event.title);
	await selectDate(page, /Starter/, event.startDateTime, "TimeDayMonthYear")
	await selectDate(page, /Slutter/, event.endDateTime, "TimeDayMonthYear")
	
	// Remove old key info items if they exists
	const buttons = page.getByRole('button', { name: 'Fjern nøkkelinformasjon' })
	while(await buttons.first().isVisible()) {
		await buttons.last().click()
	}

	// Add new key info items
	for(let i = 0; i < event.keyInfo.length; i++) {
		await page.getByRole('button', { name: 'Nøkkelinfo', exact: true }).click();
		await page.getByPlaceholder('Tittel *').nth(i).fill(event.keyInfo[i].key);
		await page.getByPlaceholder('info *').nth(i).fill(event.keyInfo[i].value);
	}
	await page.getByPlaceholder('Beskrivelse av arrangement *').fill(event.description)
}

async function saveForm(page: Page) {
	await page.getByRole('button', { name: 'Lagre' }).click()
	await page.waitForURL(/\/arrangement\/(kommende|tidligere)\/[0-9]+/)
}

async function validateEventPage(page: Page, event: TestEvent) {
	const urlRegExp = isUpcoming(event) 
		? /\/arrangement\/kommende\/[0-9]+/ 
		: /\/arrangement\/tidligere\/[0-9]+/ 
	await expect(page).toHaveURL(urlRegExp)

	await expect(page.getByText(event.title)).toBeVisible()
	await expect(page.getByText(event.description)).toBeVisible()	

	const timeText = formatDateTimeInterval(event.startDate, event.endDate)
	await expect(page.getByText(timeText)).toBeVisible()	

	for(let i = 0; i < event.keyInfo.length; i++) {
		await expect(page.getByText(event.keyInfo[i].key)).toBeVisible()
		await expect(page.getByText(event.keyInfo[i].value)).toBeVisible()
	}
}

async function clickDelete(page: Page) {
	await page.getByRole('button', { name: 'Arrangementmeny' }).click();
	page.once('dialog', dialog => dialog.accept());
	await page.getByRole('menuitem', { name: "Slett" }).click();
}

async function clickEdit(page: Page) {
	const menuButton = page.getByRole('button', { name: 'Arrangementmeny' })
	const editButton = page.getByRole('button', { name: "Rediger" })

	await Promise.race([
		menuButton.click(),
		editButton.click(),
	])
	
	const editMenuItem = page.getByRole('menuitem', { name: "Rediger" })
	const isPopupMenu = await editMenuItem.isVisible()
	if(isPopupMenu){
		await  editMenuItem.click()
	}

	await page.waitForURL(/\/arrangement\/(kommende|tidligere)\/[0-9]+\/rediger/)	
}
async function selectStatusItem(page: Page, status: ParticipationStatus) {
	const selectButton = page.getByRole("combobox", { name: /Min status/ })

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

function createRandomEvent(): TestEvent {

	const start = dayjs().add(randomInt(1, 100), "day")
						 .add(randomInt(1, 100), "hour")
						 .add(randomInt(0, 59), "minute");

	const end = dayjs(start).add(randomInt(1, 100), "hour")
							.add(randomInt(0, 59), "minute");

	const hasEndDate = randomBool()

	const event: TestEvent = {
        title: randomString("title"),
        startDateTime: start.format("YYYY-MM.DD HH:mm:ss"),
		startDate: start,
        endDateTime: hasEndDate ? end.format("YYYY-MM.DD HH:mm:ss") : null,
		endDate: hasEndDate ? end : undefined,
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

function randomBool(){
	return Math.random() < 0.5;
}
function isUpcoming(event: TestEvent) {
	const now = dayjs()
	
	if(event.endDateTime) 
		return dayjs(event.endDateTime).add(3, "hour").isAfter(now);

	return dayjs(event.startDateTime).endOf("day").add(6, "hour").isAfter(now)	
}