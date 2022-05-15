import React, { useState, createContext, useContext } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
})

const lightTheme = createTheme({
    palette: {
        mode: "light"
    }
})

export type ThemeNameType = "dark" | "light"

interface AppThemeType {
    theme: Theme,
    name: ThemeNameType
}

interface AppThemeContextType extends AppThemeType {
    changeTheme: (newThemeName: ThemeNameType, callback?: VoidFunction ) => void
}


export const AppThemeContext = createContext<AppThemeContextType>(null!)

export function useAppTheme(){
    return useContext(AppThemeContext)
}

const OsPreferDarkMode = () :boolean => 
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const getDefaultThemeName = () => {
    let themeName = localStorage.getItem("AppTheme") as ThemeNameType | null
    themeName ??= OsPreferDarkMode() ? "dark" : "light"
    return themeName
}

const setDefaultThemeName = (name: ThemeNameType) => {
    localStorage.setItem("AppTheme", name)
}

const getThemeFromName = (name: ThemeNameType): AppThemeType => {
    return name === "light"
    ? {theme: lightTheme, name: "light"}
    : {theme: darkTheme, name: "dark"}
}

export function AppThemeProvider({ children }: {children: React.ReactNode} ) {
    let defaultTheme = getThemeFromName(getDefaultThemeName())
    const [themeInfo, setTheme] = useState<AppThemeType>(defaultTheme)

    const changeTheme = (newThemeName: ThemeNameType, callback?: VoidFunction) => {
        if(newThemeName === themeInfo.name) return;

        let newThemeInfo: AppThemeType = getThemeFromName(newThemeName)
        
        setTheme(newThemeInfo)
        setDefaultThemeName(newThemeInfo.name)
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