import { Dayjs } from "dayjs"
import dayjs from "../../lib/dayjs.js"

function getDateStr(date: Dayjs): string {
    const isCurrentYear = date.year() === dayjs().year() 
    return isCurrentYear 
        ? date.format("ddd D. MMM")
        : date.format("ddd D. MMM YYYY")
}

function getTimeStr(date: Dayjs): string {
    return date.format("HH:mm")    
}

function getDateTimeStr(date: Dayjs): string {
    return `${getDateStr(date)} kl: ${getTimeStr(date)}`
}

function isSameDate(a: Dayjs, b: Dayjs) {
    return  a.format("YYYY-MM-DD") === b.format("YYYY-MM-DD")
}

function isSimilarDate(a: Dayjs, b: Dayjs) {
    return a.diff(b, "hours") < 24 && b.hour() < 6
}

export function formatDateTimeInterval(start: Dayjs, end?: Dayjs | null): string {

    if (!end) 
        return getDateTimeStr(start);

    if (isSameDate(start, end) || isSimilarDate(start, end)) 
        return `${getDateTimeStr(start)} – ${getTimeStr(end)}`;
    
    return `${getDateTimeStr(start)} – ${getDateTimeStr(end)}`
}