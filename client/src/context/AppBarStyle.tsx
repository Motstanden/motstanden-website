import { useScrollTrigger } from "@mui/material"
import { createContext, useContext, useState } from "react"

interface AppBarStyleContextType { 
    boxShadowValue: number,
    appBarBoxShadow: number,
    removeAppBarShadow: VoidFunction,
    addAppBarShadow: VoidFunction,
}

const AppBarStyleContext = createContext<AppBarStyleContextType>(null!)

export function useAppBarStyle() {
    return useContext(AppBarStyleContext)
}

const defaultShadowValue = 4

export function AppBarStyleProvider({ children }: { children: React.ReactNode }) {
 
    const [appBarHasShadow, setAppBarHasShadow] = useState(true)

    const removeAppBarShadow = () => setAppBarHasShadow(false)

    const addAppBarShadow = () => setAppBarHasShadow(true)

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    })    
    const boxShadowValue = trigger ? defaultShadowValue : 0
    
    const appBarBoxShadow = appBarHasShadow ? boxShadowValue : 0

    const contextValue: AppBarStyleContextType = { 
        boxShadowValue: boxShadowValue,
        appBarBoxShadow: appBarBoxShadow, 
        removeAppBarShadow: removeAppBarShadow,
        addAppBarShadow: addAppBarShadow,
    }

    return (
        <AppBarStyleContext.Provider value={contextValue}>
            {children}
        </AppBarStyleContext.Provider>
    )
}