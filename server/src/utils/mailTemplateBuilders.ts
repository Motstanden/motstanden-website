import { randomInt } from "crypto"
import fs from "fs/promises"

const basePath = "../../assets/mail-templates" 

enum Templates {
    MagicLink = `${basePath}/Login.html`,
    DeletedUser = `${basePath}/DeletedUser.html`,
    RestoredDeletedUser = `${basePath}/RestoredDeletedUser.html`,
    Welcome = `${basePath}/Welcome.html`,
}

async function buildMagicLinkHtml(url: string, code: string): Promise<string> {
    const html = await readFile(Templates.MagicLink)

    const {date, time} = getMagicLinkExpireTime()

    return html.replace(/{{magicLink}}/g, url)
        .replace(/{{verificationCode}}/g, code)
        .replace(/{{linkExpireDate}}/g, `${date}`)
        .replace(/{{linkExpireTime}}/g, `${time}`)
        .replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

async function buildDeletedUserHtml(userId: number): Promise<string> {
    const html = await readFile(Templates.DeletedUser)

    return html.replace(/{{userId}}/g, `${userId}`)
    .replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

async function buildRestoredDeletedUserHtml(userProfileUrl: string): Promise<string> {
    const html = await readFile(Templates.RestoredDeletedUser)
    
    return html.replace(/{{userProfileUrl}}/g, userProfileUrl)
    .replace(/{{randomFooterNumber}}/g, randomInt(0, 10000).toString())
}

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
    buildMagicLinkHtml,
    buildDeletedUserHtml,
    buildRestoredDeletedUserHtml,
    buildWelcomeHtml,
}