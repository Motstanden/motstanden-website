import { useState } from 'react'

import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { LoadingButton } from '@mui/lab'
import { Box, TextField } from '@mui/material'
import React from "react"
import { Navigate, useLocation } from 'react-router-dom'
import { useAppBarHeader } from 'src/context/AppBarHeader'
import { usePotentialUser } from 'src/context/Authentication'
import { postJson } from 'src/utils/postJson'
import { useTitle } from '../../hooks/useTitle'
import { PageContainer } from '../../layout/PageContainer/PageContainer'
import { AnimationAvatar } from './AnimationAvatar'
import DevLogin from './DevLogin'

export default function LoginPage() {
	useTitle("Logg inn")
	useAppBarHeader("Logg Inn")
	const { isLoggedIn } = usePotentialUser()
	const location = useLocation()

	if (isLoggedIn) {
		const to: string = location.state?.from?.pathname ?? "/hjem"
		return <Navigate to={to} state={{ from: location }} replace />
	}

	return (
		<PageContainer disableGutters >
			<div style={{
				textAlign: "center",
				paddingBottom: "100px"
			}}>
				<h1 style={{
					margin: "0px",
					paddingBlock: "20px"
				}}>
					Logg Inn
				</h1>
				<LoginForm />
			</div>
		</PageContainer>
	)
}

function LoginForm() {

    const [email, setEmail] = useState("")

	const [isPosting, setIsPosting] = useState(false)
    const [hasPosted, setHasPosted] = useState(false)
	const isLoading = isPosting || hasPosted

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
		setIsPosting(true)
        const emailTrimmed = email.toLowerCase().trim()

		const res = await postJson("/api/auth/magic-link", {destination: emailTrimmed}, { 
			alertOnFailure: true,  
			failureText: "Noe gikk galt. Vennligst prøv igjen senere."
		})

		if(res && res.ok) { 
			setHasPosted(true)
		}
		setIsPosting(false)
    }


    return (
        <form onSubmit={handleSubmit} method="post">
			<AnimationAvatar 
				isAnimating={isLoading} 
				style={{
					maxHeight: "min(80vw,400px)",
					maxWidth: "70%",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			/>
			{hasPosted && (
				<div style={{ marginTop: "15px" }}>
					<Box sx={{
						color: theme => theme.palette.success.main,
						fontWeight: "bold"
					}}>
						E-posten er nå på veg...
					</Box>
					<Box sx={{
						color: theme => theme.palette.text.disabled,
						fontSize: "small"
					}}>
						(Sjekk spamfilter)
					</Box>
				</div>
			)}
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
					disabled={isLoading}
                    style={{ 
                        maxWidth: "350px",
						marginTop: "25px",
                        marginBottom: "35px"
                    }}
                />
            </div>
            <LoadingButton
                variant="contained"
                size="large"
                type="submit"
                loading={isLoading}
				loadingPosition='end'
                endIcon={<ForwardToInboxIcon />}>
                Send E-post
            </LoadingButton>
            <DevLogin email={email} />
        </form>
    )
}