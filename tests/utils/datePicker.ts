import { firefox, Page } from "@playwright/test";
import { Dayjs } from "dayjs";
import dayjs from "../lib/dayjs";

export async function selectDate(
    page: Page, 
    label: string | RegExp, 
    date: Dayjs | string, 
    format: "MonthYear" | "DayMonthYear"
) {
    if(typeof date === "string")
        date = dayjs(date)

    const browserType = page.context().browser().browserType()

    if(browserType.name() === firefox.name()){
        return await ffSelectDate(page, label, date, format)
    }

    return await defaultSelectDate(page, label, date, format)
}

async function defaultSelectDate(
    page: Page, 
    label: string | RegExp, 
    date: Dayjs, 
    format: "MonthYear" | "DayMonthYear"
) {
    let dateValue: string

    if(format === "MonthYear") {
        dateValue = date.format("MMMM YYYY")
    }

    if(format === "DayMonthYear") {
        dateValue = dayjs(date).format("DD.MM.YYYY")
    }
    
    await page.getByLabel(label).fill(dateValue)
}

// ff => firefox
async function ffSelectDate(
    page: Page, 
    label: string | RegExp, 
    date: Dayjs, 
    format: "MonthYear" | "DayMonthYear"
) {
    switch (format) {
        case "MonthYear": return await ffSelectMonthYear(page, label, date)
        case "DayMonthYear": return await await ffSelectDayMonthYear(page, label, date)
    }
}

async function ffSelectMonthYear(page: Page, label: string | RegExp, date: Dayjs) {
    await page.getByLabel(label).click();
    await page.getByRole('button', { name: date.format("YYYY") }).click();
    await page.getByRole('button', { name: date.format("MMM") }).click();
    await page.getByRole('button', { name: 'OK' }).click();
}

async function ffSelectDayMonthYear(page: Page, label: string | RegExp, date: Dayjs) {
    await page.getByLabel(label).click();
    await page.getByText(/(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\s+[0-9]{4}/).click();
    await page.getByRole('button', { name: date.format("YYYY") }).click();
    await page.getByRole('button', { name: date.format("MMM") }).click();
    await page.getByRole('gridcell', { name: date.format("D") }).click();
    await page.getByRole('button', { name: 'OK' }).click();

}