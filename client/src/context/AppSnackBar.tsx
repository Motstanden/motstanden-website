import { Snackbar } from "@mui/material"
import { createContext, useContext, useState } from "react"
import { useDebounce } from "src/hooks/useDebounce"

type OpenSnackBarOptions = {
    autoHideDuration?: number | null
}

type AppSnackBarContextType = (message: string, opts?: OpenSnackBarOptions) => void

const AppSnackBarContext = createContext<AppSnackBarContextType>(null!)

export function useAppSnackBar(): AppSnackBarContextType {
    return useContext(AppSnackBarContext)
}

export function AppSnackBarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [autoHideDuration, setAutoHideDuration] = useState<number | null>(2000)

    const openSnackBar = (message: string, opts?: OpenSnackBarOptions) => {
        if(open) {
            setRefresh(true)
        }
        setMessage(message)
        setOpen(true)
        if(opts?.autoHideDuration !== undefined) {
            setAutoHideDuration(opts.autoHideDuration)
        }
    }

    const closeSnackBar = () => { 
        setOpen(false)
    }

    useDebounce( () => {
        if(!open) {
            if(refresh) {
                setRefresh(false)
                setOpen(true)
            } else {
                setMessage("")  // Wait for the snackbar to finish the close animation before clearing the message
                setAutoHideDuration(2000)
            }
        }
    }, 150, [open])

    const contextValue: AppSnackBarContextType = openSnackBar

    return (
        <AppSnackBarContext.Provider value={contextValue} >
            {children}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                onClose={closeSnackBar}
                autoHideDuration={autoHideDuration}
                message={message}
            />
        </AppSnackBarContext.Provider>
    )
}