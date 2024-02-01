import { useScrollTrigger } from "@mui/material"
import { createContext, useContext, useState } from "react"

interface AppBarStyleContextType { 
    tabBarShadow: number,
    appBarShadow: number,

    setHasFixedTabBar: React.Dispatch<React.SetStateAction<boolean>>
    hasFixedTabBar: boolean
}

const AppBarStyleContext = createContext<AppBarStyleContextType>(null!)

export function useAppBarStyle() {
    return useContext(AppBarStyleContext)
}

const defaultShadowValue = 4

export function AppBarStyleProvider({ children }: { children: React.ReactNode }) {

    const [ hasFixedTabBar, setHasFixedTabBar ] = useState(false)

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    })    
    const calculatedShadow = trigger ? defaultShadowValue : 0

    const contextValue: AppBarStyleContextType = { 
        appBarShadow: hasFixedTabBar ? 0 : calculatedShadow,
        tabBarShadow: hasFixedTabBar ? calculatedShadow : 0,
        hasFixedTabBar: hasFixedTabBar,
        setHasFixedTabBar: setHasFixedTabBar
    }

    return (
        <AppBarStyleContext.Provider value={contextValue}>
            {children}
        </AppBarStyleContext.Provider>
    )
}