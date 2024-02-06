import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightSharpIcon from '@mui/icons-material/ModeNightSharp';
import {
    IconButton,
    SxProps,
    Tooltip
} from "@mui/material";
import React from 'react';
import { useAppTheme } from 'src/context/AppTheme';


export function ThemeSwitchButton({
    style, 
    sx, 
    fontSize = "inherit"
}: {
    style?: React.CSSProperties;
    sx?: SxProps;
    fontSize?: "small" | "inherit" | "medium" | "large";
}) {

    const { isDarkMode, toggleTheme } = useAppTheme();

    return (
        <Tooltip title={isDarkMode ? "Bytt til Dagmodus" : "Bytt til Nattmodus"}>
            <IconButton
                onClick={toggleTheme}
                style={style}
                sx={sx}>
                {isDarkMode ? <ModeNightSharpIcon fontSize={fontSize} /> : <LightModeIcon fontSize={fontSize} />}
            </IconButton>
        </Tooltip>
    );
}
