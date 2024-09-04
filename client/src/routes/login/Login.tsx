import { useState } from 'react'

import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import { LoadingButton } from '@mui/lab'
import { Box, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import React from "react"
import { Navigate, useLocation } from 'react-router-dom'
import { useAppBarHeader } from 'src/context/AppBarHeader'
import { usePotentialUser, userAuthQueryKey } from 'src/context/Authentication'
import { postJson } from 'src/utils/postJson'
import { useTitle } from '../../hooks/useTitle'
import { PageContainer } from '../../layout/PageContainer/PageContainer'
import { AnimationAvatar } from './components/AnimationAvatar'

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
		<PageContainer>
			<div style={{
				textAlign: "center",
				paddingBottom: "100px"
			}}>
				<h1 style={{
					marginBottom: "20px",
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
					maxHeight: "min(85vw,400px)",
					maxWidth: "100%",
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
						Innloggingslink er nå på veg via e&#8209;post
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
                        marginBottom: "35px",
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
			{import.meta.env.VITE_ENABLE_DEV_LOGIN === "true" && (
				<DevLoginButton 
					email={email} 
					disabled={isLoading} 
				/>
			)}
        </form>
    )
}


function DevLoginButton( props: {email: string, disabled?: boolean} ) { 
	return import.meta.env.VITE_ENABLE_DEV_LOGIN === "true" 
		? <UnsafeDevLoginButton {...props} /> 
		: <></>
}

function UnsafeDevLoginButton({email, disabled}: {email: string, disabled?: boolean}) {
	const [isPosting, setIsPosting] = useState(false)
	const queryClient = useQueryClient()

    const onClick = async () => {
		setIsPosting(true)
		const res = await postJson("/api/dev/auth/login", {destination: email.toLowerCase().trim()}, { 
			alertOnFailure: true,
		})

		if(res === undefined || res.ok === false) { 
			setIsPosting(false)
		}

		if(res && res.ok) { 
			await queryClient.invalidateQueries({queryKey: userAuthQueryKey})
		}
    }

    return (
        <div style={{marginTop: "35px"}}> 
            <LoadingButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={onClick}
				loading={isPosting}
				disabled={disabled}
                sx={{ width: "172px" }}
            >
                Dev logg inn
            </LoadingButton>
        </div>
    )
}