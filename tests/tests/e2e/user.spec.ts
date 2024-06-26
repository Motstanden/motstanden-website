import { Page, expect, test } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { User } from 'common/interfaces'
import {
    getFullName,
    isNullOrWhitespace,
    userGroupToPrettyStr,
    userRankToPrettyStr,
    userStatusToPrettyStr
} from "common/utils"
import { randomInt, randomUUID } from 'crypto'
import dayjs from "../../lib/dayjs.js"
import { TestUser, disposeLogIn, logIn, unsafeApiLogIn } from '../../utils/auth.js'
import { selectDate } from '../../utils/datePicker.js'

test("New users can only be created by super admin", async ({browser}, workerInfo) => {

    const {page: adminPage } = await logIn(browser, workerInfo, UserGroup.Administrator)
    const {page: superAdminPage } = await logIn(browser, workerInfo, UserGroup.SuperAdministrator)

    await adminPage.goto("/medlem/ny")
    await superAdminPage.goto("/medlem/ny")
    
    await expect(adminPage).toHaveURL("/")
    await expect(superAdminPage).toHaveURL("/medlem/ny")

    await disposeLogIn(adminPage)
    await disposeLogIn(superAdminPage)
})

test("Admin can not promote self to super admin", async ({browser}, workerInfo) => {
    const {page, user} = await logIn(browser, workerInfo, UserGroup.Administrator)

    await gotoUser(page, user, { editUser: true})

    await page.getByRole("combobox", { name: /Rolle/ }).click()

    const superAdminCount = await page.getByRole('option', { name: userGroupToPrettyStr(UserGroup.SuperAdministrator)}).count()
    expect(superAdminCount).toBe(0)

    await disposeLogIn(page)
})

test.describe("Set inactive status", async () => {
    
    test("Contributor can not update self to be inactive", async ({browser}, workerInfo) => {
        const { page, user} = await logIn(browser, workerInfo, UserGroup.Contributor)        

        await gotoUser(page, user, {editUser: true})

        expect(await canUpdateInactive(page)).not.toBeTruthy()

        await disposeLogIn(page)
    })

    test("Admin can update self to be inactive", async ({browser}, workerInfo) => {
        const {page, user} = await logIn(browser, workerInfo, UserGroup.Administrator)

        await gotoUser(page, user, {editUser: true})

        expect(await canUpdateInactive(page)).toBeTruthy()

        await disposeLogIn(page)
    })
        
    async function canUpdateInactive(page: Page): Promise<boolean> {
        await page.getByRole("combobox", { name: /Status/ }).click()
        const inactiveCount = await page.getByRole('option', { name: userStatusToPrettyStr(UserStatus.Inactive) }).count()
        return inactiveCount === 1
    }
})

test.describe.serial("Create and update user data", async () => {
    test.slow()
    let user: UserWithoutDbData
    let userUrl: string

    test("Should create new user @smoke", async ({browser}, workerInfo) => {
        user = createUser({
            capeName: "",
            phoneNumber: null,
            birthDate: null,
            endDate: null,
            startDate: `${dayjs().format("YYYY-MM-DD")}`,  // Today
        })
        const { page } = await logIn(browser, workerInfo, UserGroup.SuperAdministrator)

        await page.goto("/medlem/ny")

        await fillPersonalForm(page, user)
    
        await page.getByRole("combobox", { name: 'Profilbilde Gutt' }).click()
        await page.getByRole('option', { name: 'Jente' }).click()
        
        await page.getByRole('button', { name: 'Legg til bruker' }).click()
        await page.waitForURL(/\/medlem\/[0-9]+/)

        userUrl = page.url()

        await validateUserProfile(page, user)

        await disposeLogIn(page)
    })

    test("Super admin can update all info @smoke", async ({browser}, workerInfo) => {
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
            await fillMembershipForm(page, user)
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
            await fillMembershipForm(page, user, {skipRank: true})
            
            await saveChanges(page)
            await validateUserProfile(page, user)
        })
    })
})

async function fillPersonalForm(page: Page, user: UserWithoutDbData) {
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

async function fillMembershipForm(page: Page, user: UserWithoutDbData, opts?: { skipRank?: boolean }) {
    await select(page, "UserStatus", user.status)
    await selectDate(page, "Startet *", user.startDate, "MonthYear")

    if(user.capeName) {
        await page.getByLabel('Kappe').fill(user.capeName)
    }
    if(user.endDate){
        await selectDate(page, "Sluttet", user.endDate, "MonthYear")
    }
    if(!opts?.skipRank){
        await select(page, "UserRank", user.rank)
    }
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

async function gotoUser(page: Page, user: TestUser, opts?: {editUser?: boolean}) {
    const url = opts?.editUser === true 
        ? `/medlem/${user.id}/rediger`
        : `/medlem/${user.id}`
    await page.goto(url)
}