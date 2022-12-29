import { chromium, FullConfig } from "@playwright/test";
import { UserGroup } from "common/enums";
import dayjs from "dayjs";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { getStoragePath, logIn } from "./utils/auth.js";


export default async function globalSetup(config: FullConfig) {
    await authSetup()
}

async function authSetup() {
    const groups = await getGroups()

    if(groups.length <= 0) 
        return

    const browser = await chromium.launch()
    for(let i = 0; i < groups.length; i++) {
        const group = groups[i]
        const page = await browser.newPage() 
        await logIn(page, group)
        await page.context().storageState({ path: getStoragePath(group) })
        await page.context().close()
    }

    await browser.close()
}

async function getGroups(): Promise<UserGroup[]> {
    const groups: UserGroup[] = Object.values(UserGroup)
    const result: UserGroup[] = []
    for(let i = 0; i < groups.length; i++) {

        const stat: fs.Stats | undefined = await fsPromises.stat(getStoragePath(groups[i]))
                                                           .catch(err => undefined)
        const fileExists = !!stat                                                   
        const fileIsOld = fileExists && dayjs(stat.birthtime).add(1, "week").isBefore(dayjs())
        if(!fileExists || fileIsOld) {
            result.push(groups[i])
        }         
    }
    return result
}