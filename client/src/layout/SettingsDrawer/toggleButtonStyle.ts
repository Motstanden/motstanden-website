import { SxProps } from "@mui/material";

const borderRadius = 12;

export const toggleButtonGroupSx: SxProps = {
    ".MuiToggleButtonGroup-grouped": {
        display: "flex",
        gap: "5px",
        textTransform: "capitalize",
        fontWeight: 550,
        fontSize: "9pt",
    },
    ".Mui-selected": {
        
    },
    ".MuiToggleButtonGroup-firstButton": {
        borderTopLeftRadius: `${borderRadius}px`,
        borderBottomLeftRadius: `${borderRadius}px`,
    },
    ".MuiToggleButtonGroup-lastButton": {
        borderTopRightRadius: `${borderRadius}px`,
        borderBottomRightRadius: `${borderRadius}px`,
    }
}