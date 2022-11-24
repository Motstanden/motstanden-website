import { Page, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { NewEventData as NewEventApiData } from 'common/interfaces';
import { randomInt, randomUUID } from 'crypto';
import dayjs from "../lib/dayjs";
import { disposeStorageLogIn, storageLogIn } from '../utils/auth';


test.describe("Contributor can update and delete events they have created", async () => {
    await testCrud({
        creator: UserGroup.Contributor,
        testId: 1
		
    })
})

test.describe.fixme("Admin can update and delete events other have created", async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		updater: UserGroup.Administrator,
		testId: 2
	})
})

test.describe.fixme("Super admin can update and delete events other have created", async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		updater: UserGroup.SuperAdministrator,
		testId: 3
	})
})

test.describe.fixme("Contributors can update other events", async () => {
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
		disposeStorageLogIn(page)
	})

	test(`Update (${opts.testId})`, async ({browser}) => {
		const page = await storageLogIn(browser, opts.updater)
    	await testUpdate(page, event1, event2)
		disposeStorageLogIn(page)
	})

	test(`Delete (${opts.testId})`, async ({browser}) => {
		const page = await storageLogIn(browser, opts.deleter)
    	await testDelete(page, event2)
		disposeStorageLogIn(page)
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
	throw "Not implemented"		// TODO	
}

async function testUpdate(page: Page, oldEvent: NewEventData, newEvent: NewEventData) {
	throw "Not implemented"		// TODO	
}

async function testDelete(page: Page, rumour: NewEventData) {
	throw "Not implemented"		// TODO	
}
