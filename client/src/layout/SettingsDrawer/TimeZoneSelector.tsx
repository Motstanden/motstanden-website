import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { toggleButtonGroupSx } from "./toggleButtonStyle";


export function TimeZoneSelector() {

    const onChange = (e: React.MouseEvent<HTMLElement, MouseEvent>) => { 
        // todo
    }

    return (
        <ToggleButtonGroup
            color="secondary"
            exclusive
            fullWidth
            size='small'
            onChange={onChange}
            sx={{
                ...toggleButtonGroupSx
            }}
        >
            <ToggleButton value="">
                Norge
            </ToggleButton>
            <ToggleButton value="">
                System
            </ToggleButton>
        </ToggleButtonGroup>
    )
}