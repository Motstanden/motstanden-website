import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import "dayjs/locale/nb";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import RelativeTime from "dayjs/plugin/relativeTime";
import timezone from 'dayjs/plugin/timezone';
import utc from "dayjs/plugin/utc";
import React from "react";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    dayjs.extend(RelativeTime)
    dayjs.locale("nb")
    dayjs.extend(utc)
    dayjs.extend(CustomParseFormat)
    dayjs.extend(timezone)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"nb"}>
            {children}
        </LocalizationProvider>

    )
}

export const relativeTimeShortFormat =  {
    ...dayjs.Ls.nb,
    name: "nb-short",
    relativeTime: {
        future: "om %s",
        past: "%s",
        s: "Nå",
        m: "1m",
        mm: "%dm",
        h: "1t",
        hh: "%dt",
        d: "1d",
        dd: "%dd",
        M: "1mnd",
        MM: "%dmnd",
        y: "1å",
        yy: "%då"
    }
}