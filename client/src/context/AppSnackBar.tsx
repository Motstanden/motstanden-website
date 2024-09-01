import { Alert, Snackbar } from "@mui/material"
import { createContext, useContext, useState } from "react"
import { useDebounce } from "src/hooks/useDebounce"

type OpenSnackBarOptions = {
    message: string,
    severity?: "error" | "warning" | "info" | "success"
    autoHideDuration?: number | null
}

type AppSnackBarContextType = (opts: OpenSnackBarOptions) => void

const AppSnackBarContext = createContext<AppSnackBarContextType>(null!)

export function useAppSnackBar(): AppSnackBarContextType {
    return useContext(AppSnackBarContext)
}

const defaultOptions: Required<OpenSnackBarOptions> = { 
    message: "",
    severity: "info",
    autoHideDuration: 5000
}

export function AppSnackBarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const [snackBarOpts, setSnackBarOpts] = useState<Required<OpenSnackBarOptions>>(defaultOptions)

    const openSnackBar = (opts: OpenSnackBarOptions) => {
        if(open) {
            setRefresh(true)
        }

        const newValues: Required<OpenSnackBarOptions> = {
            message: opts.message,
            severity: opts.severity ?? "info",
            autoHideDuration: opts.autoHideDuration === undefined  ? 5000 : opts.autoHideDuration
        }
        setSnackBarOpts(newValues)
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
                setSnackBarOpts(defaultOptions)
            }
        }
    }, 150, [open])

    const contextValue: AppSnackBarContextType = openSnackBar

    return (
        <AppSnackBarContext.Provider value={contextValue} >
            {children}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                onClose={closeSnackBar}
                autoHideDuration={snackBarOpts.autoHideDuration}
            >
                <Alert onClose={closeSnackBar} severity={snackBarOpts.severity} variant="filled">
                    {snackBarOpts.message}
                </Alert>
            </Snackbar>
        </AppSnackBarContext.Provider>
    )
}