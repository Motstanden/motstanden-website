import fs from "fs/promises"

async function buildMagicLinkHtml(url: string, code: string): Promise<string> {
    const filePath = new URL(`../../assets/mail-templates/MagicLink.html`, import.meta.url)
    const html = await fs.readFile(filePath, "utf-8")

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