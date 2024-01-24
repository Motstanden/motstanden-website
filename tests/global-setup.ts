import { FullConfig, request } from "@playwright/test";
import { UserGroup } from "common/enums";
import { testUserVariationsCount, unsafeApiLogIn, unsafeGetUser } from "./utils/auth.js";


export default async function globalSetup(config: FullConfig) {
    await authSetup()
}

async function authSetup() {
    console.log("[Setup] Authenticating users...")

    const groups = Object.values(UserGroup)
    const loginFunctions: Array<Promise<void>> = []
    
    for(let i = 0; i < groups.length; i++) {
        for(let j = 0; j < testUserVariationsCount; j++) {
            loginFunctions.push(loginUser(groups[i], j))
        }
    }

    await Promise.all(loginFunctions)

    console.log("[Setup] Done")
}

async function loginUser(userGroup: UserGroup, variantIndex: number) {
    const user = unsafeGetUser(userGroup, variantIndex)
    const apiContext = await request.newContext({ baseURL: process.env.BASEURL })
    await unsafeApiLogIn(apiContext, user.email)
    apiContext.storageState({ path: user.storageStatePath })
    apiContext.dispose()
}