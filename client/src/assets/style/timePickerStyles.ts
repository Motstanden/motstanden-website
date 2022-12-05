import { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DateTimePickerProps } from "@mui/x-date-pickers/DateTimePicker";
import { TimePickerProps } from "@mui/x-date-pickers/TimePicker";

interface BaseProps {
    desktopModeMediaQuery?: string
}

const baseStyle: BaseProps  = {
    desktopModeMediaQuery: isWebKit() ?  undefined : "@media (min-width: 600px) or (pointer: fine)"
}

function isWebKit(): boolean {
    return navigator.userAgent.indexOf('AppleWebKit') != -1
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dateTimePickerStyle: Partial<DateTimePickerProps<any, any>> = {
    ...baseStyle,
}

export const datePickerStyle: Partial<DatePickerProps<any, any>> = {
    ...baseStyle,
}

export const timePickerStyle: Partial<TimePickerProps<any, any>> = {
    ...baseStyle,
}

// Add more here if necessary...