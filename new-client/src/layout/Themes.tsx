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


export function AppThemeProvider({ children }: {children: React.ReactNode} ) {

    let defaultTheme: AppThemeType = {theme: darkTheme, name: "dark"}

    const [themeInfo, setTheme] = useState<AppThemeType>(defaultTheme)

    const changeTheme = (newThemeName: ThemeNameType, callback?: VoidFunction) => {
        if(newThemeName === themeInfo.name) return;

        let newThemeInfo: AppThemeType = newThemeName === "light"
            ? {theme: lightTheme, name: "light"}
            : {theme: darkTheme, name: "dark"}
        
        setTheme(newThemeInfo)

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