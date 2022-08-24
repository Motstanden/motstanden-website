import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import { Box } from "@mui/system"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SubmitFormButtons from "src/components/SubmitFormButtons"
import { TitleCard } from "src/components/TitleCard"
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
                <TitleCard title="Innhold">
                    <Box sx={{mt: 4}}>
                        <RichTextEditor/>
                    </Box>
                </TitleCard>
                <Box sx={{mt: 4}}>
                    <SubmitFormButtons 
                        onAbort={ e => navigate("/arrangement")} 
                        loading={isSubmitting}/>
                </Box>
            </form>
        </>
    )
}