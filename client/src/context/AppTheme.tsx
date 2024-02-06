import { ThemeProvider, useMediaQuery } from "@mui/material";
import React, { createContext, useContext, useState } from 'react';
import { AppThemeName, AppThemeProps, DarkAppTheme, LightAppTheme } from "../AppTheme";

export enum ThemeMode {
    Dark = AppThemeName.Dark,
    Light = AppThemeName.Light,
    System = "system"
}

interface AppThemeContextProps extends AppThemeProps {
    setMode: (mode: ThemeMode) => void,
    mode: ThemeMode
    isDarkMode: boolean
}

export const AppThemeContext = createContext<AppThemeContextProps>(null!)

export function useAppTheme() {
    return useContext(AppThemeContext)
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<ThemeMode>(getDefaultMode())
    
    useMediaQuery('(prefers-color-scheme: dark)');  // Trigges a rerender when the OS theme changes

    const onModeChange = (newMode: ThemeMode) => { 
        setMode(newMode)
        setDefaultMode(newMode)
    }
    
    const themeInfo = getTheme(mode)

    const contextValue: AppThemeContextProps = { 
        ...themeInfo,
        mode: mode,
        setMode: onModeChange,
        isDarkMode: themeInfo.name === AppThemeName.Dark
    }

    return (
        <AppThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={themeInfo.theme}>
                {children}
            </ThemeProvider>
        </AppThemeContext.Provider>
    )
}

const themeStorageKey = "AppTheme"

function getDefaultMode(): ThemeMode {
    const storedData = localStorage.getItem(themeStorageKey)
    const isValid = storedData && storedData in ThemeMode
    
    if(!isValid) 
        return ThemeMode.System

    return storedData as ThemeMode
}

function setDefaultMode(mode: ThemeMode) {
    localStorage.setItem(themeStorageKey, mode)
}

function osPreferDarkMode(): boolean {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getTheme(name: ThemeMode ): AppThemeProps {
    switch (name?.trim().toLowerCase()) {
        case AppThemeName.Light: 
            return LightAppTheme
        case AppThemeName.Dark: 
            return DarkAppTheme
        case ThemeMode.System:
            return osPreferDarkMode() ? DarkAppTheme : LightAppTheme
        default: 
            throw `Invalid theme mode: ${name}`
    }
}