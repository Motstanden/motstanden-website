import { DatePickerProps, DateTimePickerProps, TimePickerProps } from "@mui/x-date-pickers";
import { isWebKit } from "src/utils/isWebKit";

interface BaseProps {
    desktopModeMediaQuery?: string
}

const baseStyle: BaseProps  = {
    desktopModeMediaQuery: isWebKit() ?  undefined : "@media (min-width: 600px) or (pointer: fine)"
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const dateTimePickerStyle: Partial<DateTimePickerProps<any>> = {
    ...baseStyle,
}

export const datePickerStyle: Partial<DatePickerProps<any>> = {
    ...baseStyle,
}

export const timePickerStyle: Partial<TimePickerProps<any>> = {
    ...baseStyle,
}

// Add more here if necessary...