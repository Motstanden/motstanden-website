import { APIRequestContext, request, test as setup } from "@playwright/test";
import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import fs from "fs/promises";
import path from "path";
import { testUserVariationsCount, unsafeApiLogIn, unsafeGetUser } from "./utils/auth.js";
import { getDirname } from "./utils/getDirname.js";

setup.describe.configure({ mode: "serial" })

const __dirname = getDirname(import.meta.url)
const baseStorageState = path.join(__dirname, "storage-state", "base.json" )

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
    
    // Get assigned a user based on the user group and variant index
    const assignedUser = unsafeGetUser(userGroup, variantIndex)
    const filePath = assignedUser.storageStatePath

    // Log in the user and save it to the filepath
    await unsafeApiLogIn(apiContext, assignedUser.email)
    apiContext.storageState({ path: filePath})
    
    // Fetch the user from the database and save it to local storage
    // This will ensure faster initial loads when navigating to the website
    const dbUser = await fetchCurrentUser(apiContext)
    await saveToLocalStorage(filePath, dbUser)

    await apiContext.dispose()
}

async function fetchCurrentUser(apiContext: APIRequestContext): Promise<User> { 
    const fetchUser = await apiContext.get("/api/auth/current-user")
    if(!fetchUser.ok())
        throw `Failed to fetch current user from database`
    const user = await fetchUser.json() as User
    return user
}

async function saveToLocalStorage(path: string, user: User) {
    // NB: This must match the key used in the client
    //     client/src/context/Authentication.tsx
    const key = JSON.stringify(["user", "current"])
    
    // Playwright does not support local storage, so we have to manually update the storage state file
    // Furthermore, this is significantly faster than visiting the website with a browser 
    // and waiting for the client to update the local storage
    const storageState = await getStorageState(path)
    storageState.origins[0].localStorage.push({
        name: key,      
        value: JSON.stringify(user)
    })
    await writeStorageState(path, storageState)
}

async function getStorageState(path: string): Promise<StorageState> {
    const fileStr = await fs.readFile(path, "utf-8")
    const storageState = JSON.parse(fileStr) as StorageState
    return storageState
}

async function writeStorageState(path: string, storageState: StorageState) {
    const fileStr = JSON.stringify(storageState, null, 2)
    await fs.writeFile(path, fileStr, "utf-8")
}

interface StorageState {
    cookies: {
        name: string,
        value: string,
        domain: string,
        path: string,
        expires: number,
        httpOnly: boolean,
        secure: boolean,
        sameSite: "Strict" | "Lax" | "None"
    }[],
    origins: {
        origin: string,
        localStorage: { 
            name: string, 
            value: string 
        }[],
        sessionStorage: { 
            name: string, 
            value: string 
        }[]
    }[]
}
