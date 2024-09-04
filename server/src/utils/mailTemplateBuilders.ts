import { randomInt } from "crypto"
import fs from "fs/promises"

const basePath = "../../assets/mail-templates" 

enum Templates {
    DeactivatedUser = `${basePath}/DeactivatedUser.html`,
    DeletedUser = `${basePath}/DeletedUser.html`,
    Login = `${basePath}/Login.html`,
    ReactivatedUser = `${basePath}/ReactivatedUser.html`,
    Welcome = `${basePath}/Welcome.html`,
}

/**
 * Converts `server/assets/mail-templates/DeactivatedUser.html` to a string
 */
async function buildDeactivatedUserHtml(): Promise<string> {
    const html = await readFile(Templates.DeactivatedUser)
    return html.replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

/**
 * Converts `server/assets/mail-templates/DeletedUser.html` to a string
 */
async function buildDeletedUserHtml(): Promise<string> {
    const html = await readFile(Templates.DeletedUser)
    return html.replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

/**
 * Converts `server/assets/mail-templates/Login.html` to a string
 */
async function buildLoginHtml(url: string, code: string): Promise<string> {
    const html = await readFile(Templates.Login)

    const {date, time} = getMagicLinkExpireTime()

    return html.replace(/{{magicLink}}/g, url)
        .replace(/{{verificationCode}}/g, code)
        .replace(/{{linkExpireDate}}/g, `${date}`)
        .replace(/{{linkExpireTime}}/g, `${time}`)
        .replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

/**
 * Converts `server/assets/mail-templates/ReactivatedUser.html` to a string
 */
async function buildReactivatedUserHtml(userProfileUrl: string): Promise<string> {
    const html = await readFile(Templates.ReactivatedUser)
    
    return html.replace(/{{userProfileUrl}}/g, userProfileUrl)
        .replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

/**
 * Converts `server/assets/mail-templates/Welcome.html` to a string
 */
async function buildWelcomeHtml(url: string): Promise<string> {
    const html = await readFile(Templates.Welcome)
    const { time } = getMagicLinkExpireTime()

    return html.replace(/{{magicLink}}/g, url)
        .replace(/{{linkExpireTime}}/g, `${time}`)
        .replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

async function readFile(filePath: Templates) {
    const url = new URL(filePath.valueOf(), import.meta.url)  
    return await fs.readFile(url, "utf-8")
}

// The magic link is valid for 1 hour from now
function getMagicLinkExpireTime(): { date: string, time: string } {
    const date = new Date()
    date.setHours(date.getHours() + 1)

    const datePart = date.toLocaleDateString("no-no", { timeZone: "cet" })
    const timePart = date.toLocaleTimeString("no-no", { timeZone: "cet", hour: '2-digit', minute: '2-digit' })

    return {
        date: datePart,
        time: timePart
    }
} 

export const mailTemplates = {
    buildLoginHtml,
    buildDeactivatedUserHtml,
    buildDeletedUserHtml,
    buildReactivatedUserHtml,
    buildWelcomeHtml,
}