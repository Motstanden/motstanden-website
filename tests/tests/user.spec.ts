import test, { expect } from "@playwright/test";
import { UserGroup } from "common/enums";
import { storageLogIn } from "../utils/auth";

test.describe("Add new user", () => {
    test("Should only be accessible to super admin", async ({browser}) => {
        const adminPage = await storageLogIn(browser, UserGroup.Administrator)
        const superAdminPage = await storageLogIn(browser, UserGroup.SuperAdministrator)
        
        await adminPage.goto("/medlem/ny")
        await superAdminPage.goto("/medlem/ny")
        
        await expect(adminPage).toHaveURL("/hjem")
        await expect(superAdminPage).toHaveURL("/medlem/ny")
    })
})

