import dayjs from "dayjs";
import { createContext, useContext } from "react";
import { useLocalStorage } from "src/hooks/useStorage";
import { isEnumValue } from "src/utils/isStringEnum";

export enum TimeZone {
    Norway = "norway",
    System = "system"
}

interface TimeZoneContextType { 
    timeZone: TimeZone,
    setTimeZone: (timeZone: TimeZone) => void
    datePickerTimeZone: "Europe/Oslo" | "system"
}

const TimeZoneContext = createContext<TimeZoneContextType>(null!)

export function useTimeZone() {
    return useContext(TimeZoneContext)
}

export function TimeZoneProvider({ children }: { children: React.ReactNode }) {

    const [timeZone, setTimeZone] = useLocalStorage<TimeZone>({
        key: "TimeZone", 
        initialValue: TimeZone.Norway, 
        validateStorage: (value) => isEnumValue(TimeZone , value),
        delay: 0
    })

    const onTimeZoneChange = (newTimeZone: TimeZone) => { 
        setTimeZone(newTimeZone)
    }
    
    const tzName = getTimeZoneName(timeZone)
    dayjs.tz.setDefault(tzName)

    const datePickerTz = getDatePickerTimeZone(timeZone)

    const contextValue: TimeZoneContextType = { 
        timeZone: timeZone,
        setTimeZone: onTimeZoneChange,
        datePickerTimeZone: datePickerTz
    }

    return (
        <TimeZoneContext.Provider value={contextValue} >
            {children}
        </TimeZoneContext.Provider>
    )
}


function getTimeZoneName(timeZone: TimeZone): string | undefined {
    switch(timeZone) {
        case TimeZone.Norway: return "Europe/Oslo"
        case TimeZone.System: return undefined
    }
}

function getDatePickerTimeZone(timeZone: TimeZone) {
    switch(timeZone) {
        case TimeZone.Norway: return "Europe/Oslo"
        case TimeZone.System: return "system"
    }
}