import { request, test as setup } from "@playwright/test";
import { UserGroup } from "common/enums";
import path from "path";
import { testUserVariationsCount, unsafeApiLogIn, unsafeGetUser } from "./utils/auth.js";
import { getDirname } from "./utils/getDirname.js";

setup.describe.configure({ mode: "serial" })

setup("Set time zone to match system time zone", async ({page}) => {
    await page.goto("/")
    await page.getByRole('button', { name: 'Innstillinger' }).click();
    await page.getByRole('button', { name: 'System' }).nth(1).click();
    await page.context().storageState({ path: baseStorageState })
    console.log()
})

setup("Authenticate users", async () => {
    const groups = Object.values(UserGroup)
    const loginFunctions: Array<Promise<void>> = []
    for(let i = 0; i < groups.length; i++) {
        for(let j = 0; j < testUserVariationsCount; j++) {
            loginFunctions.push(loginUser(groups[i], j))
        }
    }
    await Promise.all(loginFunctions)
    console.log()
})

async function loginUser(userGroup: UserGroup, variantIndex: number) {
    const apiContext = await request.newContext({ baseURL: process.env.BASEURL, storageState: baseStorageState })
    
    const user = unsafeGetUser(userGroup, variantIndex)
    await unsafeApiLogIn(apiContext, user.email)
    apiContext.storageState({ path: user.storageStatePath})
    
    apiContext.dispose()
}

const __dirname = getDirname(import.meta.url)
const baseStorageState = path.join(__dirname, "storage-state", "base.json" ) 