import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightSharpIcon from '@mui/icons-material/ModeNightSharp';
import {
    IconButton,
    SxProps,
    Tooltip
} from "@mui/material";
import React from 'react';
import { ThemeName, useAppTheme } from 'src/context/Themes';


export function ThemeSwitchButton({
    style, 
    sx, 
    fontSize = "inherit"
}: {
    style?: React.CSSProperties;
    sx?: SxProps;
    fontSize?: "small" | "inherit" | "medium" | "large";
}) {

    const theme = useAppTheme();

    const isDarkMode = () => theme.name === ThemeName.Dark;

    const onClick = () => {
        const newTheme = isDarkMode() ? ThemeName.Light : ThemeName.Dark;
        theme.changeTheme(newTheme);
    };

    return (
        <Tooltip title={isDarkMode() ? "Bytt til Dagmodus" : "Bytt til Nattmodus"}>
            <IconButton
                onClick={onClick}
                style={style}
                sx={sx}>
                {isDarkMode() ? <ModeNightSharpIcon fontSize={fontSize} /> : <LightModeIcon fontSize={fontSize} />}
            </IconButton>
        </Tooltip>
    );
}
