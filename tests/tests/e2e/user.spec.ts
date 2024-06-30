import { Page, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { UpdateUserMembershipAsAdminBody, UpdateUserMembershipAsMeBody, UpdateUserPersonalInfoBody, User } from 'common/interfaces'
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
    await page.goto("/medlem/ny")

    const user: UpdateUserPersonalInfoBody = {
        firstName: `___firstName ${randomUUID().toLowerCase()}`,
        middleName: `___middleName ${randomUUID().toLowerCase()}`,
        lastName: `___lastName ${randomUUID().toLowerCase()}`,
        email: `${randomUUID().toLowerCase()}@motstanden.no`,
        birthDate: null,
        phoneNumber: null
    }
    await fillPersonalForm(page, user)

    await Promise.all([
        page.waitForURL(/\/medlem\/[0-9]+/),
        page.getByRole('button', { name: 'Legg til bruker' }).click()
    ])

    await validatePersonalInfo(page, user)

    await disposeLogIn(page)
})


// ************* Update personal info ***************

test.describe("Update personal info", () => {

    test("As self", async ({page}, workerInfo) => {

        // Create new user and log in as that user
        const user = await api.users.createRandom(workerInfo)
        await unsafeApiLogIn(page.request, user.email)
        
        await runTest(page, user)
    })

    test("As super admin", async ({browser}, workerInfo) => {

        // Create new user and log in as another super admin user
        const user = await api.users.createRandom(workerInfo)
        const { page } = await logIn(browser, workerInfo, UserGroup.SuperAdministrator)

        await runTest(page, user)
        await disposeLogIn(page)
    })

    async function runTest(page: Page, user: User) {
        await page.goto(`/medlem/${user.id}`)
        
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


async function fillPersonalForm(page: Page, user: UpdateUserPersonalInfoBody) {
    await page.getByLabel('Fornavn *').fill(user.firstName)
    await page.getByLabel('Mellomnavn').fill(user.middleName)
    await page.getByLabel('Etternavn *').fill(user.lastName)
    await page.getByLabel('E-post *').fill(user.email)
    
    if(user.birthDate){
        await selectDate(page, "Fødselsdato", user.birthDate, "DayMonthYear")
    }
    if(user.phoneNumber){
        await page.getByLabel('Tlf.').fill(`${user.phoneNumber}`)
    }
}


async function validatePersonalInfo(page: Page, user: UpdateUserPersonalInfoBody) {
    await expect(page).toHaveURL(/\/medlem\/[0-9]+$/)
    await expect(page.getByText(getFullName(user)).first()).toBeVisible()
    await expect(page.getByText(user.email)).toBeVisible()

    if(user.birthDate) {
        const birthDate = dayjs(user.birthDate).format("DD MMMM YYYY")
        await expect(page.getByText(birthDate)).toBeVisible()
    }

    if(user.phoneNumber) {
        await expect(page.getByText(`${user.phoneNumber}`)).toBeVisible()
    }
}

// ************* Update membership info ***************

test.describe("Update membership info", () => { 

    test("As self", async ({page}, workerInfo) => { 

        // Create new user and log in as that user
        const user = await api.users.createRandom(workerInfo)
        await unsafeApiLogIn(page.request, user.email)

        await runTest(page, user, { updateRank: false })      // Can update all except rank
    })

    test("As Admin", async ({browser}, workerInfo) => { 

        // Create new user and log in as another admin user
        const user = await api.users.createRandom(workerInfo)
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

        await page.goto(`/medlem/${user.id}`)
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

// ************* Obsolete Tests ***************

test.describe.serial("Create and update user data", async () => {
    test.slow()
    let user: UserWithoutDbData
    let userUrl: string

    test("Super admin can update all info @smoke", async ({browser}, workerInfo) => {

        // This test is broken AF
        test.fixme()

        const { page } = await logIn(browser, workerInfo, UserGroup.SuperAdministrator)
        
        await page.goto(`${userUrl}/rediger`)

        user = createUser({
            groupName: UserGroup.Editor,
            rank: UserRank.Ohm,
            status: UserStatus.Active
        })

        await fillPersonalForm(page, user)
        await fillMembershipForm(page, user)
        await select(page, "UserGroup", user.groupName)
        await saveChanges(page)
        await validateUserProfile(page, user)

        await disposeLogIn(page)
    })

    test("Admin can update membership info", async ({browser}, workerInfo) => {

        // This test is broken AF
        test.fixme()

        const { page } = await logIn(browser, workerInfo, UserGroup.Administrator)

        await page.goto(`${userUrl}/rediger`)

        const newData = createUser()
        user = {
            ...user,
            // Data that the admin is allowed to change
            capeName: newData.capeName,
            rank: UserRank.MegaOhm,
            status: UserStatus.Retired,
            startDate: newData.startDate,
            endDate: newData.endDate,
            groupName: UserGroup.Administrator
        }
        
        // Expect personal details to be read only
        expect(await page.getByLabel('Fornavn *').count()).toBe(0)
        expect(await page.getByLabel('Mellomnavn').count()).toBe(0)
        expect(await page.getByLabel('Etternavn *').count()).toBe(0)
        expect(await page.getByLabel('E-post *').count()).toBe(0)
        expect(await page.getByLabel("Fødselsdato").count()).toBe(0)
        expect(await page.getByLabel('Tlf.').count()).toBe(0)
        
        await fillMembershipForm(page, user)
        await select(page, "UserGroup", user.groupName)
        await saveChanges(page)
        await validateUserProfile(page, user)

        await disposeLogIn(page)
    })

    test("User can update info about themselves", async ({page}) => {

        // This test is broken AF
        test.fixme()

        await unsafeApiLogIn(page.request, user.email)

        await page.goto(`${userUrl}/rediger`)
        await expect(page).toHaveURL(`${userUrl}/rediger`)

        await test.step("Admin can update all", async () => {
            user = createUser({ 
                groupName: UserGroup.Contributor, 
                rank: UserRank.KiloOhm,
                status: UserStatus.Veteran 
            })
    
            await fillPersonalForm(page, user)
            // await fillMembershipForm(page, user)
            await select(page, "UserGroup", user.groupName)
            await saveChanges(page)
            await validateUserProfile(page, user)
        })

        await test.step("Contributor can update all except rank and group",  async () => {
            await clickEditButton(page)
            
            // Expect the user not to be able to edit rank or group
            expect(await page.getByRole("combobox", { name: /Rang/ }).count()).toBe(0)
            expect(await page.getByRole("combobox", { name: /Rolle/ }).count()).toBe(0)
            
            user = createUser({
                rank: user.rank,
                groupName: user.groupName,
                status: UserStatus.Retired
            })
        
            await fillPersonalForm(page, user)
            // await fillMembershipForm(page, user, {skipRank: true})
            
            await saveChanges(page)
            await validateUserProfile(page, user)
        })
    })
})

interface UserWithoutDbData extends Omit<User,  "id" | "groupId" | "createdAt" | "updatedAt" > {}

function createUser(userData?: Partial<UserWithoutDbData>): UserWithoutDbData {
    const uuid: string = randomUUID().toLowerCase()
    const user: UserWithoutDbData = {
        email: `${uuid}@motstanden.no`,
        groupName: UserGroup.Contributor,
        rank: UserRank.ShortCircuit,
        firstName: "__Test",
        middleName: "User",
        lastName: uuid,
        profilePicture: "files/private/profilbilder/girl.png",
        status: UserStatus.Active,
        startDate: `2019-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        endDate: `2022-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        capeName: `cape id ${uuid}`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: `${randomInt(1980, 2003)}-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        ...userData
    }
    return user
}

async function clickEditButton(page: Page) {
    await page.getByRole('link', { name: 'Rediger Profil' }).click()
    await expect(page).toHaveURL(/\/medlem\/[0-9]+\/rediger/)
}

async function saveChanges(page: Page) {
    await page.getByRole('button', { name: 'Lagre' }).click()
    await page.waitForURL(/\/medlem\/[0-9]+$/)
}

async function validateUserProfile(page: Page, user: UserWithoutDbData) {

    const fullName = getFullName(user)
    await expect(page.getByText(fullName).first()).toBeVisible()

    const formatDate = (date: string): string => dayjs(date).locale("nb").format("MMMM YYYY").toLowerCase()

    const startAndEndDate = `${formatDate(user.startDate)} - ${isNullOrWhitespace(user.endDate) ? "dags dato" : formatDate(user.endDate)}` 

    // We expect all items in this array to be visible on the user profile page (exactly once)
    const uniqueData: string[] = [
        user.email, 
        userRankToPrettyStr(user.rank),
        startAndEndDate
    ]

    // The group is not unique on the page if it is contributor
    if(user.groupName !== UserGroup.Contributor)
        uniqueData.push(userGroupToPrettyStr(user.groupName))

    // The status is not unique on the page if it is Active
    if(user.status !== UserStatus.Active)
        uniqueData.push(userStatusToPrettyStr(user.status))

    if(!isNullOrWhitespace(user.capeName))
        uniqueData.push(user.capeName)
    
    if(user.phoneNumber)
        uniqueData.push(`${user.phoneNumber}`)

    if(!isNullOrWhitespace(user.birthDate))
        uniqueData.push(dayjs(user.birthDate).format("DD MMMM YYYY"))
    
    for(let i = 0; i < uniqueData.length; i++) {
        await expect(page.getByText(uniqueData[i])).toBeVisible()
    }

    const absentData: string[] = []
    if(user.groupName === UserGroup.Contributor) {
        const allEnums: UserGroup[] = getEnums<UserGroup>(UserGroup)
        const groupTexts = allEnums.filter(val => val !== UserGroup.Contributor)
                                   .map(val => userGroupToPrettyStr(val))
        absentData.push(...groupTexts)
    }

    if(user.status === UserStatus.Active) {
        const allEnums: UserStatus[] = getEnums<UserStatus>(UserStatus)
        const statusTexts = allEnums.filter(val => val !== UserStatus.Active)
                                    .map(val => userStatusToPrettyStr(val))
        absentData.push(...statusTexts)
    }

    for(let i = 0; i < absentData.length; i++) {
        await expect(page.getByText(absentData[i])).not.toBeVisible()
    }

}

function getEnums<T>(enumObj: {}): T[] {
    return Object.keys(enumObj)
                 .map(itemStr => enumObj[itemStr as keyof typeof enumObj] as T)
}