import { Page, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { NewUser, UpdateUserMembershipAsAdminBody, UpdateUserMembershipAsMeBody, UpdateUserPersonalInfoBody, User } from 'common/interfaces'
import {
    getFullName,
    isNullOrWhitespace,
    userGroupToPrettyStr,
    userRankToPrettyStr,
    userStatusToPrettyStr
} from "common/utils"
import { randomInt, randomUUID } from 'crypto'
import dayjs from "../../lib/dayjs.js"
import { api } from '../../utils/api/index.js'
import { disposeLogIn, logIn, unsafeApiLogIn } from '../../utils/auth.js'
import { selectDate } from '../../utils/datePicker.js'


test("Create new user @smoke", async ({browser}, workerInfo) => {
    const { page } = await logIn(browser, workerInfo, UserGroup.SuperAdministrator)
    await page.goto("/brukere/ny")
    
    const user: PersonalInfo = {
        firstName: `___firstName ${randomUUID().toLowerCase()}`,
        middleName: `___middleName ${randomUUID().toLowerCase()}`,
        lastName: `___lastName ${randomUUID().toLowerCase()}`,
        email: `${randomUUID().toLowerCase()}@motstanden.no`,
    }

    await fillPersonalForm(page, user)
    await Promise.all([
        page.waitForURL(/\/brukere\/[0-9]+/),
        page.getByRole('button', { name: 'Legg til bruker' }).click()
    ])
    await validatePersonalInfo(page, user)

    await disposeLogIn(page)
})


// ************* Update personal info ***************

test.describe("Update personal info", () => {

    let user: User

    test.beforeEach( async ({}, workerInfo) => {
        user = await api.users.createRandom(workerInfo)
    })

    test.afterEach( async ({}, workerInfo) => {
        await api.users.delete(workerInfo, user.id)
    })

    test("As self", async ({page}, workerInfo) => {
        // Log in as the new user
        await unsafeApiLogIn(page.request, user.email)
        
        await runTest(page, user)
    })

    test("As super admin", async ({browser}, workerInfo) => {
        const { page } = await logIn(browser, workerInfo, UserGroup.SuperAdministrator)

        await runTest(page, user)
        await disposeLogIn(page)
    })

    async function runTest(page: Page, user: User) {
        await page.goto(`/brukere/${user.id}`)
        
        const newUserData: UpdateUserPersonalInfoBody = {
            firstName: `___firstName ${randomUUID().toLowerCase()}`,
            middleName: `___middleName ${randomUUID().toLowerCase()}`,
            lastName: `___lastName ${randomUUID().toLowerCase()}`,
            email: `${randomUUID().toLowerCase()}@motstanden.no`,
            phoneNumber: randomInt(10000000, 99999999),
            birthDate: `${randomInt(1980, 2003)}-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        }

        await clickEdit(page, "personal")
        await fillPersonalForm(page, newUserData)
        await clickSave(page)
        await validatePersonalInfo(page, newUserData)
    }
})

type PersonalInfo = UpdateUserPersonalInfoBody | Omit<NewUser, "profilePicture">

async function fillPersonalForm(page: Page, user: PersonalInfo) {
    await page.getByLabel('Fornavn *').fill(user.firstName)
    await page.getByLabel('Mellomnavn').fill(user.middleName)
    await page.getByLabel('Etternavn *').fill(user.lastName)
    await page.getByLabel('E-post *').fill(user.email)
    
    if("birthDate" in user && user.birthDate !== null){
        await selectDate(page, "Fødselsdato", user.birthDate, "DayMonthYear")
    }
    if("phoneNumber" in user && user.phoneNumber !== null){
        await page.getByLabel('Tlf.').fill(`${user.phoneNumber}`)
    }
}


async function validatePersonalInfo(page: Page, user: PersonalInfo) {
    await expect(page).toHaveURL(/\/brukere\/[0-9]+$/)
    await expect(page.getByText(getFullName(user)).first()).toBeVisible()
    await expect(page.getByText(user.email)).toBeVisible()

    if("birthDate" in user && user.birthDate !== null) {
        const birthDate = dayjs(user.birthDate).format("DD MMMM YYYY")
        await expect(page.getByText(birthDate)).toBeVisible()
    }

    if("phoneNumber" in user && user.phoneNumber !== null) {
        await expect(page.getByText(`${user.phoneNumber}`)).toBeVisible()
    }
}

// ************* Update membership info ***************

test.describe("Update membership", () => { 

    let user: User

    test.beforeEach( async ({}, workerInfo) => {
        user = await api.users.createRandom(workerInfo)
    })

    test.afterEach( async ({}, workerInfo) => {
        await api.users.delete(workerInfo, user.id)
    })

    test("As self", async ({page}, workerInfo) => { 
        // Log in as the new user
        await unsafeApiLogIn(page.request, user.email)

        await runTest(page, user, { updateRank: false })      // Can update all except rank
    })

    test("As Admin", async ({browser}, workerInfo) => { 
        // Create new user and log in as another admin user
        const { page } = await logIn(browser, workerInfo, UserGroup.Administrator)

        await runTest(page, user, { updateRank: true }) // Can update all
        await disposeLogIn(page)
    })

    async function runTest(page: Page, user: User, { updateRank }: { updateRank: boolean }) {

        const base: UpdateUserMembershipAsMeBody = {
            capeName: `capeName ${randomUUID().toLowerCase()}`,
            startDate: `2019-${randomInt(1, 12)}-${randomInt(1, 28)}`,
            endDate: `2023-${randomInt(1, 12)}-${randomInt(1, 28)}`,
            status: UserStatus.Retired
        }
        const newData: MemberShipBody = updateRank 
            ? { ...base, rank: UserRank.MegaOhm }
            : base 

        await page.goto(`/brukere/${user.id}`)
        await clickEdit(page, "membership")
        await fillMembershipForm(page, newData)
        await clickSave(page)
        await validateMembership(page, newData)
    }
})


type MemberShipBody = UpdateUserMembershipAsMeBody | UpdateUserMembershipAsAdminBody

async function fillMembershipForm(page: Page, user: MemberShipBody) {
    await page.getByLabel('Kappe').fill(user.capeName)
    await select(page, "UserStatus", user.status)
    await selectDate(page, "Startet *", user.startDate, "MonthYear")
    await selectDate(page, "Sluttet", user.endDate, "MonthYear")

    if("rank" in user) {
        await select(page, "UserRank", user.rank)
    }
}


async function validateMembership(page: Page, user: MemberShipBody) {

    // Cape name
    await expect(page.getByText(user.capeName)).toBeVisible()

    // Status
    const statusText = userStatusToPrettyStr(user.status)
    if(user.status === UserStatus.Active) {
        // Status will match two elements if it is active: 'Status: Aktiv' and 'Aktiv periode'

        const status = await page.getByText(statusText).all()
        expect(status).toHaveLength(2)
        await expect(status[0]).toBeVisible()
        await expect(status[1]).toBeVisible()

    } else {
        // All other statuses will only match one element

        await expect(page.getByText(statusText)).toBeVisible()
    }

    // Start and end date
    const formatDate = (date: string): string => dayjs(date).locale("nb").format("MMMM YYYY").toLowerCase()
    const startDate = formatDate(user.startDate)
    const endDate = isNullOrWhitespace(user.endDate)   ? "dags dato" : formatDate(user.endDate)
    const dateText = `${startDate} - ${endDate}`
    await expect(page.getByText(dateText)).toBeVisible()

    // Rank
    if("rank" in user) {
        await expect(page.getByText(userRankToPrettyStr(user.rank))).toBeVisible()
    }
}

// ***************** Update role info *****************

test.describe("Update role", () => { 

    testCanUpdateRole({
        title: "As admin",
        updater: UserGroup.Administrator,
        newRole: UserGroup.Administrator
    })

    testCanUpdateRole({
        title: "As super admin",
        updater: UserGroup.SuperAdministrator,
        newRole: UserGroup.SuperAdministrator
    })

    async function testCanUpdateRole({ title, updater, newRole }: { title: string, updater: UserGroup, newRole: UserGroup}) { 

        test(title, async ({browser}, workerInfo) => { 
                
            // Create new user and log in as "updater"
            const user = await api.users.createRandom(workerInfo)
            const { page } = await logIn(browser, workerInfo, updater)

            await page.goto(`/brukere/${user.id}`)
            await clickEdit(page, "role")
            await select(page, "UserGroup", newRole)
            await clickSave(page)
            
            const roleText = userGroupToPrettyStr(newRole)
            await expect(page.getByText(roleText)).toBeVisible()    // NOTE: This will fail if the role is "Contributor"

            await disposeLogIn(page)
            await api.users.delete(workerInfo, user.id)
        })
    }
})

// **************** Shared Utils ******************

async function clickEdit(page: Page, variant: "personal" | "membership" | "role") {
    
    const getLabel = () => { 
        switch(variant) {
            case "personal":    return "Rediger personalia"
            case "membership":  return "Rediger medlemskap"
            case "role":        return "Rediger brukerkonto"
        }
    }

    const buttonLabel = getLabel()
    await page.getByLabel(buttonLabel).click()
    await page.getByRole('button', { name: 'Lagre' }).waitFor({ state: 'visible' })     // Note: This will not work if the test is editing multiple forms at once
}


async function clickSave(page: Page) {
    const button = page.getByRole('button', { name: 'Lagre' })
    await button.click(),
    await button.waitFor({ state: 'detached'})
}


type UserEnum = UserRank | UserGroup | UserStatus
type UserEnumName = "UserRank" | "UserGroup" | "UserStatus"

async function select<T extends UserEnum>(page: Page, typeName: UserEnumName,  value: T) {

    let buttonRegEx: RegExp
    let selectValue: string
    switch(typeName) {
        case "UserRank": 
            buttonRegEx = /Rang/
            selectValue = userRankToPrettyStr(value as UserRank)
            break
        case "UserGroup": 
            buttonRegEx = /Rolle/
            selectValue = userGroupToPrettyStr(value as UserGroup)
            break
        case "UserStatus": 
            buttonRegEx = /Status/
            selectValue = userStatusToPrettyStr(value as UserStatus)
            break
        default: 
            throw `The type is not implemented: "${typeName}"`
    }

    await page.getByRole("combobox", { name: buttonRegEx}).click()
    await page.getByRole('option', { name: selectValue, exact: true }).click()
}

