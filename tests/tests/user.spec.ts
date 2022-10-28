import test, { expect } from '@playwright/test';
import { UserGroup, UserRank, UserStatus } from 'common/enums';
import { NewUser } from 'common/interfaces';
import {
    isNullOrWhitespace,
    userGroupToPrettyStr,
    userRankToPrettyStr,
    userStatusToPrettyStr
} from "common/utils";
import { randomInt, randomUUID } from 'crypto';
import dayjs from '../lib/dayjs';
import { storageLogIn } from '../utils/auth';

test.describe("Add new user", () => {
    test("Should only be accessible to super admin", async ({browser}) => {
        const adminPage = await storageLogIn(browser, UserGroup.Administrator)
        const superAdminPage = await storageLogIn(browser, UserGroup.SuperAdministrator)
        
        await adminPage.goto("/medlem/ny")
        await superAdminPage.goto("/medlem/ny")
        
        await expect(adminPage).toHaveURL("/hjem")
        await expect(superAdminPage).toHaveURL("/medlem/ny")
    })

    const newUser = createNewUser()

    test("Should create new user", async ({browser}) => {

        const page = await storageLogIn(browser, UserGroup.SuperAdministrator)
        await page.goto("/medlem/ny")

        await test.step("Post new user", async () => {

            await page.getByLabel('Fornavn *').fill(newUser.firstName);
            await page.getByLabel('Mellomnavn').fill(newUser.middleName);
            await page.getByLabel('Etternavn *').fill(newUser.lastName);
            await page.getByLabel('E-post *').fill(newUser.email);
          
            await page.getByRole('button', { name: `Rang ${userRankToPrettyStr(UserRank.ShortCircuit)}` }).click();
            await page.getByRole('option', { name: userRankToPrettyStr(newUser.rank) }).click();
          
            await page.getByRole('button', { name: `Rolle ${userGroupToPrettyStr(UserGroup.Contributor)}` }).click();
            await page.getByRole('option', { name: userGroupToPrettyStr(UserGroup.Editor) }).click();
          
            await page.getByRole('button', { name: `Status ${userStatusToPrettyStr(UserStatus.Active)}` }).click();
            await page.getByRole('option', { name: userStatusToPrettyStr(newUser.status) }).click();
          
            await page.getByLabel('Startet *').fill(formatDate(newUser.startDate));
            await page.getByLabel('Sluttet').fill(formatDate(newUser.endDate));
          
            await page.getByRole('button', { name: 'Profilbilde Gutt' }).click();
            await page.getByRole('option', { name: 'Jente' }).click();
          
            await page.getByLabel('All informasjon er riktig(Ingen vei tilbake)').check();
          
            await page.getByRole('button', { name: 'Legg til bruker' }).click();
        })

        await test.step("Test user exists", async () => {
            await page.goto("/medlem/liste")
            await page.getByLabel('Styret').check();

            const fullName = getFullName(newUser)
            await expect(page.getByText(fullName)).toBeVisible()
            
            const userLink = page.getByRole('link', { name: fullName })   
            await userLink.click()

            await expect(page).toHaveURL(/\/medlem\/[1-9]+/)
            await expect(page.getByText(fullName).first()).toBeVisible()

            // We expect all items in this array to be visible on the user profile page
            const userData = [
                newUser.email, 
                userRankToPrettyStr(newUser.rank),
                userGroupToPrettyStr(newUser.groupName),
                userStatusToPrettyStr(newUser.status),
                formatDate(newUser.startDate),
                formatDate(newUser.endDate)
            ]
            for(let i = 0; i < userData.length; i++) {
                await expect(page.getByText(userData[i])).toBeVisible()
            }
        })

    })
})

function createNewUser(): NewUser {
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
        startDate: "2019-01-01",
        endDate: "2022-01-01",
        capeName: `cape id ${uuid}`,
        phoneNumber: randomInt(10000000, 99999999),
        birthDate: "2000-01-01"
    }
    return newUser;
}

function getFullName(user: {firstName: string, middleName: string, lastName: string}): string {
    const lastName = isNullOrWhitespace(user.middleName) 
                   ? user.lastName 
                   : user.middleName + " " + user.lastName
    return user.firstName + " " + lastName
}

function formatDate(date: string): string {
    return dayjs(date).locale("nb").format("MMMM YYYY").toLowerCase()
}