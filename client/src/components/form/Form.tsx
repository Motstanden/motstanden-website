import Divider from "@mui/material/Divider"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
    value: {},
    children: React.ReactNode 
    postUrl: string
    disabled?: boolean
    preventSubmit?: () => boolean
    onPostSuccess?: () => void
    onPostFailure?: () => void
    onAbortClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()  

        if(preventSubmit && preventSubmit())
            return;

        setIsSubmitting(true)        
        let response = await fetch(postUrl, {
            method: "POST", 
            body: JSON.stringify(value),
            headers: {
                "Content-Type": "application/json"
            }
        })  
        if(response.ok){
            onPostSuccess && onPostSuccess()
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