import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import FormHelperText from '@mui/material/FormHelperText';
import React, { useState } from "react"
import { json } from 'stream/consumers';
import DevLogin from './DevLogin';
import { MagicLinkResponse } from 'common/interfaces';

export function EmailLogin( { onEmailSent }: {onEmailSent: (e: EmailInfo) => void }) {
    
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
        setIsSubmitting(true)
        const emailTrimmed = email.toLowerCase().trim()
        if(!validateEmail(emailTrimmed)) {
            console.log("Email invalid")
            setIsValidEmail(false)
            setIsSubmitting(false)
            return;
        }

        // POST a request with the users email or phone number to the server
        const res = await fetch("/api/auth/magic_login", {
            method: `POST`,
            body: JSON.stringify({
                destination: emailTrimmed,
            }),
                headers: { 'Content-Type': 'application/json' }
            })
        const data = await res.json() as MagicLinkResponse  // TODO: Display data
        if(data.success) {
            onEmailSent({
                code: data.code,
                email: email
            })
        }
        setIsSubmitting(false)
    }

    function onEmailChanged(event: React.ChangeEvent<HTMLInputElement>){
        setIsValidEmail(true)
        setEmail(event.target.value)
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField 
                label="E-post"
                type="email"
                value={email}
                onChange={onEmailChanged}
                error={!isValidEmail}
                required
                fullWidth
                style={{ maxWidth: "350px" }}
                />
            <br/>
            <br/>
				{!isValidEmail && (<><FormHelperText error={true} style={{ textAlign: "center" }}>Ugyldig E-postadresse</FormHelperText><br /></>)}
            <Button 
                variant="contained"
                size="large"
                type="submit"
                disabled={!isValidEmail || isSubmitting}
                endIcon={<ForwardToInboxIcon/>}>
                Send E-post
            </Button>
            <DevLogin email={email}/>
        </form>
    )
}

const emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

function validateEmail(email: string | undefined) : boolean {
    if(!email)
        return false;
    
    return emailRegEx.test(email)
}

export interface EmailInfo {
    email: string,
    code: string
}