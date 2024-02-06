import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ThemeMode, useAppTheme } from "src/context/AppTheme";

export function ThemeSelector() {
    const { mode, setMode } = useAppTheme();
    const borderRadius = 12;

    const onChange = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const value = e.currentTarget.getAttribute("value") as ThemeMode;
        setMode(value);
    };

    return (
        <ToggleButtonGroup
            color="secondary"
            value={mode}
            exclusive
            fullWidth
            size='small'
            onChange={onChange}
            aria-label="Platform"
            sx={{
                ".MuiToggleButtonGroup-grouped": {
                    display: "flex",
                    gap: "5px",
                    textTransform: "capitalize",
                    fontWeight: 550,
                    fontSize: "9pt",
                    // color: `${theme.palette.text.secondary}f5`,
                },
                ".Mui-selected": {
                    // color: theme.palette.text.primary + " !important",
                    // borderColor: theme.palette.secondary.dark,
                },
                ".MuiToggleButtonGroup-firstButton": {
                    borderTopLeftRadius: `${borderRadius}px`,
                    borderBottomLeftRadius: `${borderRadius}px`,
                },
                ".MuiToggleButtonGroup-lastButton": {
                    borderTopRightRadius: `${borderRadius}px`,
                    borderBottomRightRadius: `${borderRadius}px`,
                }
            }}
        >
            <ToggleButton value={ThemeMode.Light}>
                <LightModeIcon />
                Dag
            </ToggleButton>
            <ToggleButton value={ThemeMode.System}>
                <SettingsBrightnessIcon />
                System
            </ToggleButton>
            <ToggleButton value={ThemeMode.Dark}>
                <DarkModeIcon />
                Natt
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
