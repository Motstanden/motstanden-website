import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { Button, TextField } from "@mui/material"
import { MagicLinkResponse } from 'common/interfaces'
import React, { useState } from "react"
import DevLogin from './DevLogin'

export function EmailLogin({ onEmailSent }: { onEmailSent: (e: EmailInfo) => void }) {

    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true)
        const emailTrimmed = email.toLowerCase().trim()

        // POST a request with the users email or phone number to the server
        const res = await fetch("/api/auth/magic-link", {
            method: `POST`,
            body: JSON.stringify({
                destination: emailTrimmed,
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json() as MagicLinkResponse  // TODO: Display data
        if (data.success) {
            onEmailSent({
                code: data.code,
                email: email
            })
        }
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} method="post">
            <div>
                <TextField
                    label="E-post"
                    type="email"
                    name='email'
                    autoComplete='email'
                    aria-label='email'
                    spellCheck={false}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    fullWidth
                    style={{ 
                        maxWidth: "350px", 
                        marginBottom: "35px"
                    }}
                />
            </div>
            <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={isSubmitting}
                endIcon={<ForwardToInboxIcon />}>
                Send E-post
            </Button>
            <DevLogin email={email} />
        </form>
    )
}

export interface EmailInfo {
    email: string,
    code: string
}