import {
    DatePickerProps,
    DateTimePickerProps,
    TimePickerProps
} from '@mui/x-date-pickers';

interface BaseProps {
    desktopModeMediaQuery?: string
}

const baseStyle: BaseProps  = {
    desktopModeMediaQuery: "@media (min-width: 600px) or (pointer: fine)"
}

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