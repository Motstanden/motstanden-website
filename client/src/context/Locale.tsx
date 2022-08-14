import React from "react";
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import "dayjs/locale/nb"
import utc from "dayjs/plugin/utc"

export function LocaleProvider( {children}: {children: React.ReactNode}) {
    dayjs.locale("nb")
    dayjs.extend(utc)
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"nb"}>
            {children}
        </LocalizationProvider>

    )
}