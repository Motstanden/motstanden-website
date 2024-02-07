import dayjs from "dayjs";
import { createContext, useContext, useState } from "react";

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

    const [timeZone, setTimeZone] = useState<TimeZone>(getDefaultTimeZone())

    const onTimeZoneChange = (newTimeZone: TimeZone) => { 
        setTimeZone(newTimeZone)
        setDefaultTimeZone(newTimeZone)
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

const timeZoneStorageKey = "TimeZone"

function getDefaultTimeZone(): TimeZone {
    const storedData = localStorage.getItem(timeZoneStorageKey)
    const isValid = storedData && Object.values(TimeZone).includes(storedData as TimeZone)
    if(!isValid) 
        return TimeZone.Norway

    return storedData as TimeZone
}

function setDefaultTimeZone(timeZone: TimeZone) {
    localStorage.setItem(timeZoneStorageKey, timeZone)
}