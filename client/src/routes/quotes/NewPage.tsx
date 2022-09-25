import React, { useState } from "react"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace";
import { NewQuote } from "common/interfaces";
import { useTitle } from "src/hooks/useTitle";
import { postJson } from "src/utils/postJson";
import { useNavigate } from "react-router-dom";
import { useContextInvalidator } from "./Context";

export function NewQuotePage() {
    useTitle("Nytt sitat*")
    return (
        <>
            <h1>Nytt sitat</h1>
            <NewQuoteForm/>
        </>
    )
}

function NewQuoteForm(){
    const [newQuote, setNewQuote] = useState<NewQuote>({quote: "", utterer: ""})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate() 
    const contextInvalidator = useContextInvalidator()
    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)
        const data: NewQuote = {
            utterer: newQuote.utterer.trim(),
            quote: newQuote.quote.trim()
        }

        const response = await postJson("/api/insert_quote", data, { alertOnFailure: true })
        if(response?.ok){
            contextInvalidator()
            navigate("/sitater")
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <UpsertQuoteInputs quoteData={newQuote} onChange={newVal => setNewQuote(newVal)}/>
            <Button 
                variant="contained" 
                size="large"
                type="submit"
                sx={{mt: 4}}
                disabled={isSubmitting || isNullOrWhitespace(newQuote.utterer) || isNullOrWhitespace(newQuote.quote)}
                endIcon={<SendIcon/>} >
                Legg inn sitat
            </Button>
        </form>
    )
}

export function UpsertQuoteInputs( {quoteData, onChange}: {quoteData: NewQuote, onChange: (newVal: NewQuote) => void}) {

    return (
        <>
            <TextField 
                label="Sitat"
                name="quote"
                type="text"
                required 
                fullWidth
                autoComplete="off"
                value={quoteData.quote}
                onChange={(e) => onChange({...quoteData, quote: e.target.value})}
                multiline
                minRows={4}
                sx={{mb: 4}}
                />
            <TextField 
                label="Sitatytrer" 
                name="utterer"
                type="text"
                required 
                fullWidth 
                autoComplete="off"
                value={quoteData.utterer}
                onChange={(e) => onChange({...quoteData, utterer: e.target.value})}
                sx={{maxWidth: "600px"}}/>
        </>

    )
}