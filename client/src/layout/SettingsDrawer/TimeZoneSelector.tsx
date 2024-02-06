import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { TimeZone, useTimeZone } from "src/context/TimeZone";
import { toggleButtonGroupSx } from "./toggleButtonStyle";

export function TimeZoneSelector() {

    const { timeZone, setTimeZone} = useTimeZone()

    const onChange = (e: React.MouseEvent<HTMLElement, MouseEvent>) => { 
        const value = e.currentTarget.getAttribute("value") as TimeZone
        setTimeZone(value)
    }

    return (
        <ToggleButtonGroup
            value={timeZone}
            color="secondary"
            exclusive
            fullWidth
            size='small'
            onChange={onChange}
            sx={{
                ...toggleButtonGroupSx
            }}
        >
            <ToggleButton value={TimeZone.Norway}>
                Norge
            </ToggleButton>
            <ToggleButton value={TimeZone.System}>
                System
            </ToggleButton>
        </ToggleButtonGroup>
    )
}