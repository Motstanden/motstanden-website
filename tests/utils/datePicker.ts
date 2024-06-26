import { Page } from "@playwright/test"
import dayjs from "../lib/dayjs.js"
import { isMobile } from "./mediaQueries.js"

type dateFormat = "MonthYear" | "DayMonthYear" | "TimeDayMonthYear"

export async function selectDate(
    page: Page, 
    label: string | RegExp, 
    date: dayjs.Dayjs | string | undefined | null, 
    format: dateFormat
) {
    const isMobilePage = await isMobile(page)

    if(!date && isMobilePage)
        throw "Not implemented";

    if(!date) 
        return await page.getByLabel(label).fill("");

    if(typeof date === "string")
        date = dayjs(date);
   
    if(isMobilePage) {
        return await mobileSelectDate(page, label, date, format)
    }        

    return await desktopSelectDate(page, label, date, format)
}

async function desktopSelectDate(
    page: Page, 
    label: string | RegExp, 
    date: dayjs.Dayjs, 
    format: dateFormat
) {

    let dateValue: string
    switch (format) {
        case "MonthYear":
            dateValue = date.format("MMMM YYYY")
            break
        case "DayMonthYear":
            dateValue = dayjs(date).format("DD.MM.YYYY")
            break
        case "TimeDayMonthYear":
            dateValue = dayjs(date).format("DD.MM.YYYY HH:mm")
            break
        default:
            throw new Error("Not implemented");
    }

    await page.getByLabel(label).fill(dateValue)
}

// This is not thoroughly tested
async function mobileSelectDate(
    page: Page, 
    label: string | RegExp, 
    date: dayjs.Dayjs, 
    format: dateFormat
) {
    switch (format) {
        case "MonthYear": 
            return await mobileSelectMonthYear(page, label, date)
        case "DayMonthYear": 
            return await await mobileSelectDayMonthYear(page, label, date)
        case "TimeDayMonthYear": 
            throw "Not implemented"
        default: 
            throw "Not implemented"
    }
}

// This is not thoroughly tested
async function mobileSelectMonthYear(page: Page, label: string | RegExp, date: dayjs.Dayjs) {
    await page.getByLabel(label).click();
    await page.getByRole('button', { name: date.format("YYYY") }).click();
    await page.getByRole('button', { name: date.format("MMM") }).click();
    await page.getByRole('button', { name: 'OK' }).click();
}

// This is not thoroughly tested
async function mobileSelectDayMonthYear(page: Page, label: string | RegExp, date: dayjs.Dayjs) {
    await page.getByLabel(label).click();
    await page.getByText(/(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\s+[0-9]{4}/).click();
    await page.getByRole('button', { name: date.format("YYYY") }).click();
    await page.getByRole('button', { name: date.format("MMM") }).click();
    await page.getByRole('gridcell', { name: date.format("D") }).click();
    await page.getByRole('button', { name: 'OK' }).click();
}