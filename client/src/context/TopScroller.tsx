import React, { useContext, useLayoutEffect, useState } from "react"
import { useLocation } from "react-router-dom"

interface TopScrollerContextType {
    preventNextScroll: (prevent: boolean) => void
}

const TopScrollerContext = React.createContext<TopScrollerContextType>(null!)

export function useTopScroller() {
    return useContext(TopScrollerContext)
}

export function TopScrollerProvider({ children }: { children: React.ReactNode }) {
    const [preventNextScroll, setPreventNextScroll] = useState(false)

    const location = useLocation();
    useLayoutEffect(() => {
        const childHandlesScroll = !!location.hash

        const shouldScroll = !childHandlesScroll && !preventNextScroll 
        if (shouldScroll) {
            window.scrollTo({ top: 0, left: 0})
        }
        setPreventNextScroll(false)
    }, [location.pathname])  

    const contextValue: TopScrollerContextType = { 
        preventNextScroll: (prevent: boolean) => setPreventNextScroll(prevent)
    }

    return (
        <TopScrollerContext.Provider value={contextValue}>
            {children}
        </TopScrollerContext.Provider>
    )
}