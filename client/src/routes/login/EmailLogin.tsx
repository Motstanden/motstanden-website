import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import FormHelperText from '@mui/material/FormHelperText';
import { useState } from "react"
import { json } from 'stream/consumers';

export function EmailLogin() {
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

        const emailTrimmed = email.trim()
        if(!validateEmail(emailTrimmed)) {
            console.log("Email invalid")
            setIsValidEmail(false)
            return;
        }

        // POST a request with the users email or phone number to the server
        const res = await fetch("api/auth/magic_login", {
            method: `POST`,
            body: JSON.stringify({
                destination: emailTrimmed,
            }),
                headers: { 'Content-Type': 'application/json' }
            })
        
        const data = await res.json()   // TODO: Display data
        console.log(data)
    }

    function onEmailChanged(event: React.ChangeEvent<HTMLInputElement>){
        setIsValidEmail(true)
        setEmail(event.target.value)
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField 
                label="E-post"
                type="text"
                color="secondary"
                value={email}
                onChange={onEmailChanged}
                error={!isValidEmail}
                required
                fullWidth
                style={{ maxWidth: "350px" }}
                />
            <br/>
            <br/>
				{!isValidEmail && (<><FormHelperText error={true} style={{ textAlign: "center" }}>Ugyldig E-post adresse</FormHelperText><br /></>)}
            <Button 
                variant="contained"
                color="secondary"
                size="large"
                type="submit"
                disabled={!isValidEmail}
                endIcon={<ForwardToInboxIcon/>}>
                Send E-post
            </Button>
        </form>
    )
}

const emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

function validateEmail(email: string | undefined) : boolean {
    if(!email)
        return false;
    
    return emailRegEx.test(email)
}