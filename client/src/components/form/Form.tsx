import Divider from "@mui/material/Divider"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import postJson from "src/utils/postJson"
import SubmitFormButtons from "./SubmitButtons"

export function Form( {
    value, 
    children,
    disabled,
    postUrl,
    preventSubmit,
    onPostSuccess,
    onPostFailure,
    onAbortClick
}: { 
    value: {} | ( () => {} )    // Either any object, or a callback function that returns the object
    children: React.ReactNode 
    postUrl: string
    disabled?: boolean
    preventSubmit?: () => boolean
    onPostSuccess?: ( (res: Response) => Promise<void> ) | ( (res: Response) => void )
    onPostFailure?: () => void
    onAbortClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()  

        if(preventSubmit && preventSubmit())
            return;
        setIsSubmitting(true)        

        let newValue = typeof value === "function" ? value() : value
        let response = await postJson(postUrl, newValue)
        if(response.ok){
            onPostSuccess && await onPostSuccess(response)
        }
        else {
            onPostFailure && onPostFailure()
            console.log(response)
            window.alert("Noe gikk galt\nSi ifra til webansvarlig")
        }
        setIsSubmitting(false)
    } 

    return (
        <>
            <form onSubmit={onSubmit}>
                {children}
                <div style={{marginTop: "4em"}}>
                    <SubmitFormButtons loading={isSubmitting} onAbort={onAbortClick} disabled={disabled}/>
                </div>
            </form>
            <Divider sx={{my: 3}}/>
        </>
    )
}
