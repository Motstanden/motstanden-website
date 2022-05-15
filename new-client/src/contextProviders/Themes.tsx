import React, { useState, createContext, useContext } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';


export enum ThemeName {
    Dark = "dark",
    Light = "light"
}

type AppThemeType = {
    theme: Theme,
    name: ThemeName
}

const darkTheme: AppThemeType = {
    name: ThemeName.Dark,
    theme: createTheme({
        palette: {
            mode: 'dark'
        }
    })
}

const lightTheme: AppThemeType = {
    name: ThemeName.Light,
    theme: createTheme({
        palette: {
            mode: 'light'
        }
    })
}

const OsPreferDarkMode = () :boolean => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const objectToTheme = (name: string | ThemeName | null | undefined) : AppThemeType  => {
    switch(name?.trim().toLowerCase()){
        case ThemeName.Light: return lightTheme
        case ThemeName.Dark:  return darkTheme
        default: return OsPreferDarkMode() ? darkTheme : lightTheme
    }
}

const themeStorageKey = "AppTheme"

const getDefaultTheme = (): AppThemeType => {
    let storedData = localStorage.getItem(themeStorageKey)
    let theme = objectToTheme(storedData)
    return theme;
} 

const setDefaultTheme = (theme: AppThemeType ) => localStorage.setItem(themeStorageKey, theme.name)

interface AppThemeContextType extends AppThemeType {
    changeTheme: (newThemeName: ThemeName, callback?: VoidFunction ) => void
}

export const AppThemeContext = createContext<AppThemeContextType>(null!)

export function useAppTheme(){
    return useContext(AppThemeContext)
}

export function AppThemeProvider({ children }: {children: React.ReactNode} ) {
    const [themeInfo, setTheme] = useState<AppThemeType>(getDefaultTheme())

    const changeTheme = (newThemeName: ThemeName, callback?: VoidFunction) => {
        if(newThemeName === themeInfo.name) return;

        let newThemeInfo: AppThemeType = objectToTheme(newThemeName)
        
        setTheme(newThemeInfo)
        setDefaultTheme(newThemeInfo)
        if(callback) callback();
    }

    let contextValue = {...themeInfo, changeTheme}

    return  ( 
        <AppThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={themeInfo.theme}>
                {children}
            </ThemeProvider>
        </AppThemeContext.Provider>
    )
}