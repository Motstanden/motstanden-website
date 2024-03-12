import { Snackbar } from "@mui/material"
import { createContext, useContext, useState } from "react"
import { useDebounce } from "src/hooks/useDebounce"

type AppSnackBarContextType = (message: string) => void

const AppSnackBarContext = createContext<AppSnackBarContextType>(null!)

export function useAppSnackBar(): AppSnackBarContextType {
    return useContext(AppSnackBarContext)
}

export function AppSnackBarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [refresh, setRefresh] = useState(false)

    const openSnackBar = (message: string) => {
        if(open) {
            setRefresh(true)
        }
        setMessage(message)
        setOpen(true)
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
                autoHideDuration={2000}
                message={message}
            />
        </AppSnackBarContext.Provider>
    )
}