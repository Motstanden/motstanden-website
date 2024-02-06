import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ThemeName, useAppTheme } from "src/context/Themes";

export function ThemeSelector() {
    const { name, setMode } = useAppTheme();
    const borderRadius = 12;

    const onChange = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const value = e.currentTarget.getAttribute("value") as ThemeName;
        setMode(value);
    };

    return (
        <ToggleButtonGroup
            color="secondary"
            value={name}
            exclusive
            fullWidth
            size='small'
            onChange={onChange}
            // onChange={handleChange}
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
            <ToggleButton value={ThemeName.Light}>
                <LightModeIcon />
                Dag
            </ToggleButton>
            <ToggleButton value="system">
                <SettingsBrightnessIcon />
                System
            </ToggleButton>
            <ToggleButton value={ThemeName.Dark}>
                <DarkModeIcon />
                Natt
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
