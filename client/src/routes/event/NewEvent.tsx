import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SubmitFormButtons from "src/components/SubmitFormButtons"
import { RichTextEditor } from "./RichTextEditor"

export function NewEventPage(){
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();

        setIsSubmitting(true)
    }
    return (
        <>
            <h1>Nytt arrangement</h1>
            <form onSubmit={onSubmit}>
                <Paper sx={{mb: 4, p: 2, pt: 0}} elevation={6}>
                    <h2 style={{paddingTop: "20px", paddingBottom: 0, marginBottom: 0}}>Innhold</h2>
                    <Divider sx={{mt: 0, mb: 4}}/>
                    <RichTextEditor/>
                </Paper>
                <SubmitFormButtons 
                    onAbort={ e => navigate("/arrangement")} 
                    loading={isSubmitting}/>
            </form>
        </>
    )
}