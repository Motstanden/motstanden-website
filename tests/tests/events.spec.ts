import { expect, Page, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { NewEventData as NewEventApiData } from 'common/interfaces';
import { randomInt, randomUUID } from 'crypto';
import dayjs from "../lib/dayjs";
import { disposeStorageLogIn, storageLogIn } from '../utils/auth';
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

test.describe("Contributors can update other events", async () => {
    await testCrud({
		creator: UserGroup.Editor,
		updater: UserGroup.Contributor,
        deleter: UserGroup.Editor,
		testId: 4
	})
})

test.fixme("Users can participate on events", async () => {
	throw "Not implemented"		// TODO	
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
		value = value.slice(Math.max(0, value.length - maxChars - 1)) 	// Prioritize end of string
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
	
	// TODO: 
	//	1. Clear existing end time, and insert new end time
	//	2. Clear existing key info, and insert new key info

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