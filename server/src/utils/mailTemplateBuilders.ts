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
        .replace(/{{randomFooterNumber}}/g, code)
}

async function buildDeletedUserHtml(userId: number): Promise<string> {
    const html = await readFile(Templates.DeletedUser)
    return html.replace(/{{userId}}/g, `${userId}`)
}

async function buildRestoredDeletedUserHtml(): Promise<string> {
    throw new Error("Not implemented")
}

async function buildWelcomeHtml(url: string): Promise<string> {
    const html = await readFile(Templates.Welcome)
    
    const { time } = getMagicLinkExpireTime()
    const randomNumber = randomInt(0, 10000)

    return html.replace(/{{magicLink}}/g, url)
        .replace(/{{linkExpireTime}}/g, `${time}`)
        .replace(/{{randomFooterNumber}}/g, `${randomNumber}`)
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