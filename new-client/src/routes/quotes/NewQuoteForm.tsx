import React, { useState } from "react"
import { Button, TextField } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

export function NewQuoteForm(){
    const [utterer, setUtterer] = useState("");
    const [quote, setQuote] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setIsSubmitting(true)
        const data = {
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
                label="Sitatyttrer" 
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
            <Button 
                variant="contained" 
                color="secondary"
                size="large"
                type="submit"
                disabled={isSubmitting || isNullOrWhitespace(utterer) || isNullOrWhitespace(quote)}
                endIcon={<SendIcon/>} >
                Legg inn sitat
            </Button>
        </form>
    )
}

function isNullOrWhitespace(str: string | undefined): boolean {
    if(!str){
        return true
    }
    return /^\s*$/.test(str);
  }