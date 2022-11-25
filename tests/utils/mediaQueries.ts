import { Page } from "@playwright/test"

const media = {
    isSmallScreen: () => matchMedia("(max-width: 600px)").matches,
    
    isTouchScreen: () => !matchMedia("(pointer: fine)").matches        // There are probably cases where this is not correct. For now, this is good enough.
}

export async function isSmallScreen(page: Page): Promise<boolean> {
    return await page.evaluate(media.isSmallScreen)
}

export async function isTouchScreen(page: Page): Promise<boolean> {
    return await page.evaluate(media.isTouchScreen)
}

export async function isMobile(page: Page): Promise<boolean> {
    // There are probably cases where this is not correct. For now, this is good enough.
    return await isSmallScreen(page) && 
           await isTouchScreen(page)     
}