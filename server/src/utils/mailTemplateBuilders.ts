import fs from "fs/promises"

const basePath = "../../assets/mail-templates" 

enum Templates {
    MagicLink = `${basePath}/MagicLink.html`,
    DeletedUser = `${basePath}/DeletedUser.html`,
    RestoredDeletedUser = `${basePath}/RestoredDeletedUser.html`,
    Welcome = `${basePath}/Welcome.html`,
}

async function readFile(filePath: Templates) {
    const url = new URL(filePath.valueOf(), import.meta.url)  
    return await fs.readFile(url, "utf-8")
}

async function buildMagicLinkHtml(url: string, code: string): Promise<string> {
    const html = await readFile(Templates.MagicLink)

    const date = new Date().toLocaleString("no-no", { timeZone: "cet" })

    return html.replace("${magiclink}", url)
        .replace("${verificationcode}", code)
        .replace("${timestamp}", `${date}`)
}

async function buildDeletedUserHtml(): Promise<string> {
    throw new Error("Not implemented")
}

async function buildRestoredDeletedUserHtml(): Promise<string> {
    throw new Error("Not implemented")
}

async function buildWelcomeHtml(): Promise<string> {
    throw new Error("Not implemented")
}

export const mailTemplates = {
    buildMagicLinkHtml,
    buildDeletedUserHtml,
    buildRestoredDeletedUserHtml,
    buildWelcomeHtml,
}