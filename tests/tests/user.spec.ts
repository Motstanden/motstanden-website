import test, { expect, Page } from '@playwright/test'
import { UserGroup, UserRank, UserStatus } from 'common/enums'
import { NewUser } from 'common/interfaces'
import {
    isNullOrWhitespace,
    userGroupToPrettyStr,
    userRankToPrettyStr,
    userStatusToPrettyStr
} from "common/utils"
import { randomInt, randomUUID } from 'crypto'
import dayjs from '../lib/dayjs'
import { emailLogIn, storageLogIn } from '../utils/auth'

test("New users can only be created by super admin", async ({browser}) => {
    const adminPage = await storageLogIn(browser, UserGroup.Administrator)
    const superAdminPage = await storageLogIn(browser, UserGroup.SuperAdministrator)
    
    await adminPage.goto("/medlem/ny")
    await superAdminPage.goto("/medlem/ny")
    
    await expect(adminPage).toHaveURL("/hjem")
    await expect(superAdminPage).toHaveURL("/medlem/ny")
})

test.describe.serial("Create and update user data", async () => {

    let user: NewUser
    let page: undefined | Page

    test("Should create new user", async ({browser}) => {
        user = createNewUser({
            capeName: null,
            phoneNumber: null,
            birthDate: null
        })
        page = await storageLogIn(browser, UserGroup.SuperAdministrator)

        await page.goto("/medlem/ny")

        await test.step("Post new user", async () => {

            await fillPersonalForm(page, user)
            await fillMembershipForm(page, user)
        
            await select(page, "UserGroup", user.groupName)
          
            await page.getByRole('button', { name: 'Profilbilde Gutt' }).click()
            await page.getByRole('option', { name: 'Jente' }).click()
          
            await page.getByLabel('All informasjon er riktig(Ingen vei tilbake)').check()
          
            await page.getByRole('button', { name: 'Legg til bruker' }).click()
        })

        await test.step("Test user exists", async () => {
            await gotoUserProfile(page, user)
            await validateUserProfile(page, user)
        })
    })

    test("Super admin can update all info", async () => {
        
        user = createNewUser({
            groupName: UserGroup.Contributor,
            rank: UserRank.Ohm,
            status: UserStatus.Active
        })

        await editCurrentUser(page)
        
        await fillPersonalForm(page, user)
        await fillMembershipForm(page, user)
        await select(page, "UserGroup", user.groupName)
        await saveChanges(page)
        await validateUserProfile(page, user)

    })

    test("Admin can update membership info", async ({browser}) => {
        page = await storageLogIn(browser, UserGroup.Administrator)
        const newData = createNewUser()
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
        
        await gotoUserProfile(page, user)
        await editCurrentUser(page)
        
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
    })

    test("Admin can update all info on themselves", async ({page}) => {
        await emailLogIn(page, user.email)
        await gotoUserProfile(page, user)
        await editCurrentUser(page)
        
        user = createNewUser({ groupName: UserGroup.Contributor })
        await fillPersonalForm(page, user)
        await fillMembershipForm(page, user)
        await select(page, "UserGroup", user.groupName)
        await saveChanges(page)
        await validateUserProfile(page, user)
    })
})

async function fillPersonalForm(page: Page, user: NewUser) {
    await page.getByLabel('Fornavn *').fill(user.firstName)
    await page.getByLabel('Mellomnavn').fill(user.middleName)
    await page.getByLabel('Etternavn *').fill(user.lastName)
    await page.getByLabel('E-post *').fill(user.email)
    
    if(user.birthDate){
        await page.getByLabel("Fødselsdato").fill(birthFormat(user.birthDate))
    }
    if(user.phoneNumber){
        await page.getByLabel('Tlf.').fill(`${user.phoneNumber}`)
    }
}

async function fillMembershipForm(page: Page, user: NewUser) {
    if(user.capeName) {
        await page.getByLabel('Kappe').fill(user.capeName)
    }
    await select(page, "UserRank", user.rank)
    await select(page, "UserStatus", user.status)
    await page.getByLabel('Startet *').fill(monthFormat(user.startDate))
    await page.getByLabel('Sluttet').fill(monthFormat(user.endDate))
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

    await page.getByRole('button', { name: buttonRegEx}).click()
    await page.getByRole('option', { name: selectValue }).click()
}

function createNewUser(userData?: Partial<NewUser>): NewUser {
    const uuid: string = randomUUID().toLowerCase()
    const newUser: NewUser = {
        email: `${uuid}@motstanden.no`,
        groupName: UserGroup.Editor,
        rank: UserRank.KiloOhm,
        firstName: "__Test",
        middleName: "User",
        lastName: uuid,
        profilePicture: "files/private/profilbilder/girl.png",
        status: UserStatus.Veteran,
        startDate: `2019-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        endDate: `2022-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        capeName: `cape id ${uuid}`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: `${randomInt(1980, 2003)}-${randomInt(1, 12)}-${randomInt(1, 28)}`,
        ...userData
    }
    return newUser
}

interface UserName {
    firstName: string, 
    middleName: string, 
    lastName: string
}

function getFullName(user: UserName): string {
    const lastName = isNullOrWhitespace(user.middleName) 
                   ? user.lastName 
                   : user.middleName + " " + user.lastName
    return user.firstName + " " + lastName
}

function monthFormat(date: string): string {
    return dayjs(date).locale("nb").format("MMMM YYYY").toLowerCase()
}

function birthFormat(date: string): string {
    return dayjs(date).format("DD.MM.YYYY")
}

async function gotoUserProfile(page: Page, user: UserName) {
    await page.goto("/medlem/liste")
    await page.getByLabel('Styret').check()

    const fullName = getFullName(user)
    await expect(page.getByText(fullName)).toBeVisible()
    
    const userLink = page.getByRole('link', { name: fullName })   
    await userLink.click()

    await expect(page).toHaveURL(/\/medlem\/[0-9]+/)
    await expect(page.getByText(fullName).first()).toBeVisible()
}

async function editCurrentUser(page: Page) {
    await page.getByRole('link', { name: 'Rediger Profil' }).click()
    await expect(page).toHaveURL(/\/medlem\/[0-9]+\/rediger/)
}

async function saveChanges(page: Page) {
    await page.getByRole('button', { name: 'Lagre' }).click()
    await expect(page).toHaveURL(/\/medlem\/[0-9]+/)
}

async function validateUserProfile(page: Page, user: NewUser) {

    const fullName = getFullName(user)
    await expect(page.getByText(fullName).first()).toBeVisible()

    // We expect all items in this array to be visible on the user profile page (exactly once)
    const uniqueData: string[] = [
        user.email, 
        userRankToPrettyStr(user.rank),
        monthFormat(user.startDate),
        monthFormat(user.endDate)
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