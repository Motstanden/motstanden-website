import { Alert, AlertTitle, Box, Snackbar } from "@mui/material"
import { isNullOrWhitespace } from "common/utils"
import { createContext, useContext, useState } from "react"
import { useDebounce } from "src/hooks/useDebounce"

type OpenSnackBarOptions = {
    title?: string,
    message: string,
    messageDetails?: string,
    severity?: "error" | "warning" | "info" | "success"
    autoHideDuration?: number | null
}

type AppSnackBarContextType = (opts: OpenSnackBarOptions) => void

const AppSnackBarContext = createContext<AppSnackBarContextType>(null!)

export function useAppSnackBar(): AppSnackBarContextType {
    return useContext(AppSnackBarContext)
}

const defaultOptions: Required<OpenSnackBarOptions> = { 
    title: "",
    message: "",
    messageDetails: "",
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
            title: opts.title ?? "",
            message: opts.message,
            messageDetails: opts.messageDetails ?? "",
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
                sx={ 
                    // Force snack bar to render above React Query Devtools
                    import.meta.env.DEV ? { zIndex: 200000 } : {}
                }
            >
                <Alert onClose={closeSnackBar} severity={snackBarOpts.severity} variant="filled" >
                    {!isNullOrWhitespace(snackBarOpts.title) && (
                        <AlertTitle sx={{fontWeight: "bolder"}}>
                            {snackBarOpts.title}
                        </AlertTitle>
                    )}
                    {snackBarOpts.message}
                    {!isNullOrWhitespace(snackBarOpts.messageDetails) && (
                        <Box sx={{
                            opacity: 0.85,
                            fontSize: "0.8em",
                        }}>
                            {snackBarOpts.messageDetails}
                        </Box>
                    )}
                </Alert>
            </Snackbar>
        </AppSnackBarContext.Provider>
    )
}