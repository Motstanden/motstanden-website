import { FullConfig, request } from "@playwright/test";
import { UserGroup } from "common/enums";
import { apiLogIn, getStoragePath, getUser } from "./utils/auth.js";


export default async function globalSetup(config: FullConfig) {
    await authSetup()
}

async function authSetup() {
    
    console.log("[Setup] Authenticating users...")

    const groups = Object.values(UserGroup)

    for(let i = 0; i < groups.length; i++) {
        const group = groups[i]
        const user = getUser(group)

        const apiContext = await request.newContext({ baseURL: process.env.BASEURL })
        await apiLogIn(apiContext, user.email)
        apiContext.storageState({ path: getStoragePath(group) })
        apiContext.dispose()
    }

    console.log("[Setup] All users authenticated")
}