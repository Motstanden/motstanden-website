import dayjs from "../../lib/dayjs"

export function formatDateTimeInterval(startStr: string, endStr: string | null): string {
    const start = dayjs(startStr)

    const dayFormat = start.year() === dayjs().year()
        ? "ddd D. MMM"
        : "ddd D. MMM YYYY,"
    const hourFormat = "HH:mm"

    if (!endStr) {
        return `${start.format(dayFormat)} kl: ${start.format(hourFormat)}`
    }

    const end = dayjs(endStr)
    const isSameDate = start.format("YYYY-MM-DD") === end.format("YYYY-MM-DD")
    const isSmallDiff = start.diff(end, "hours") < 24 && end.hour() < 6

    if (isSameDate || isSmallDiff) {
        return `${start.format(dayFormat)} kl: ${start.format(hourFormat)} – ${end.format(hourFormat)}`
    }
    return `${start.format(dayFormat)} kl: ${start.format(hourFormat)} – ${end.format(dayFormat)} kl: ${end.format(hourFormat)}`
}