import { useScrollTrigger } from "@mui/material"
import { createContext, useContext, useState } from "react"

interface AppBarStyleContextType { 
    boxShadow: number,
    removeBoxShadow: VoidFunction,
    addBoxShadow: VoidFunction,
}

const AppBarStyleContext = createContext<AppBarStyleContextType>(null!)

export function useAppBarStyle() {
    return useContext(AppBarStyleContext)
}

export const appBarBoxShadow = 4

export function AppBarStyleProvider({ children }: { children: React.ReactNode }) {
 
    const [boxShadow, setBoxShadow] = useState(appBarBoxShadow)

    const removeBoxShadow = () => setBoxShadow(0)

    const addBoxShadow = () => setBoxShadow(appBarBoxShadow)

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    })    
    const shadowValue = trigger ? boxShadow : 0

    const contextValue: AppBarStyleContextType = { 
        boxShadow: shadowValue,
        removeBoxShadow: removeBoxShadow,
        addBoxShadow: addBoxShadow,
    }

    return (
        <AppBarStyleContext.Provider value={contextValue}>
            {children}
        </AppBarStyleContext.Provider>
    )
}