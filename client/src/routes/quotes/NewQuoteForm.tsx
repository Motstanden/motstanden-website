import React, { useState } from "react"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { isNullOrWhitespace } from "src/utils/isNullOrWhitespace";
import { NewQuote } from "common/interfaces";

export function NewQuoteForm(){
    const [utterer, setUtterer] = useState("");
    const [quote, setQuote] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)
        const data: NewQuote = {
            utterer: utterer.trim(),
            quote: quote.trim()
        }
        let response = await fetch("/api/insert_quote", {
            method: "POST", 
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })  
        window.location.reload()
    }

    return (
        <form onSubmit={onSubmit}>
            <TextField 
                label="Sitat"
                name="quote"
                type="text"
                required 
                fullWidth
                autoComplete="off"
                value={quote}
                onChange={(event) => setQuote(event.target.value)}
                multiline
                minRows={4}
                />
            <br/>
            <br/>
            <TextField 
                label="Sitatytrer" 
                name="utterer"
                type="text"
                required 
                fullWidth 
                autoComplete="off"
                value={utterer}
                onChange={(event) => setUtterer(event.target.value)}
                sx={{maxWidth: "600px"}}/>
            <br/>
            <br/>
            <Button 
                variant="contained" 
                size="large"
                type="submit"
                disabled={isSubmitting || isNullOrWhitespace(utterer) || isNullOrWhitespace(quote)}
                endIcon={<SendIcon/>} >
                Legg inn sitat
            </Button>
        </form>
    )
}