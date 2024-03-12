import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ThemeMode, useAppTheme } from "src/context/AppTheme";
import { toggleButtonGroupSx } from './toggleButtonStyle';

export function ThemeSelector() {
    const { mode, setMode } = useAppTheme();

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
            sx={{
                ...toggleButtonGroupSx
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
