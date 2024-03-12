import { Page } from "@playwright/test";

export async function navigateSideDrawer(page: Page, navigation: SideDrawerNavigation) {
    await page.getByRole("link", { name: navigation }).click()
    const expectedUrl = getUrl(navigation)
    await page.waitForURL(expectedUrl)
}

export enum SideDrawerNavigation { 
    Home = "hjem",
    Event = "arrangement",
    Quotes = "sitater",
    Rumours = "rykter",
    Polls = "avstemninger",
    SheetArchive = "noter",
    Lyric = "tekster",
    Documents = "dokumenter",
    BoardWebsite = "styrets nettsider"
}

function getUrl(item: SideDrawerNavigation): RegExp | string {
    switch (item) { 
        case SideDrawerNavigation.Home: 
            return /^(\/|\/hjem)$/;
        case SideDrawerNavigation.Event: 
            return "/arrangement/kommende";
        case SideDrawerNavigation.Quotes: 
            return "/sitater";
        case SideDrawerNavigation.Rumours: 
            return "/rykter";
        case SideDrawerNavigation.Polls: 
            return "/avstemninger";
        case SideDrawerNavigation.SheetArchive: 
            return "/notearkiv/repertoar";
        case SideDrawerNavigation.Lyric: 
            return "/studenttraller/populaere";
        case SideDrawerNavigation.Documents: 
            return "/dokumenter";
        case SideDrawerNavigation.BoardWebsite: 
            return "/styret-nettsider";
        default: 
            throw `Not implemented`
    }
}