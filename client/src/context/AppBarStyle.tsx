import { useScrollTrigger } from "@mui/material"
import { createContext, useContext, useState } from "react"
import { useAppBarHeight, useTabBarHeight } from "src/layout/useAppSizes"

interface AppBarStyleContextType { 
    tabBarShadow: number,
    appBarShadow: number,

    setHasFixedTabBar: React.Dispatch<React.SetStateAction<boolean>>
    hasFixedTabBar: boolean,

    scrollMarginTop: number,
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

    const tabBarHeight = useTabBarHeight()
    const appBarHeight = useAppBarHeight()
    const scrollMarginTop = hasFixedTabBar ? tabBarHeight + appBarHeight : appBarHeight
    
    const contextValue: AppBarStyleContextType = { 
        appBarShadow: hasFixedTabBar ? 0 : calculatedShadow,
        tabBarShadow: hasFixedTabBar ? calculatedShadow : 0,

        hasFixedTabBar: hasFixedTabBar,
        setHasFixedTabBar: setHasFixedTabBar,
        
        scrollMarginTop: scrollMarginTop
    }

    return (
        <AppBarStyleContext.Provider value={contextValue}>
            {children}
        </AppBarStyleContext.Provider>
    )
}