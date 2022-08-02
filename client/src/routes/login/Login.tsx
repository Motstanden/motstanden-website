import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import LoginIcon from '@mui/icons-material/Login';
import TextField from '@mui/material/TextField';

import { AnimationAvatar } from './AnimationAvatar';
import { PageContainer } from '../../layout/PageContainer';
import { useAuth } from '../../context/Authentication';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTitle } from '../../hooks/useTitle';

interface ILocationProps {
	state: {
	  	from: Location;
	}
}

export function LoginPage() {
	useTitle("Logg inn")
	let location = useLocation() as ILocationProps;
	return ( 
		<PageContainer>
			<div style={{textAlign: "center"}}>
				<h1 style={{marginBottom: "50px"}}>Logg inn</h1>
				<LoginForm loginRedirect={location.state?.from?.pathname || "/hjem"}/>
			</div>
		</PageContainer>
	)
} 

function LoginForm( { loginRedirect }: {loginRedirect: string}) {
	let [isSubmitting, setIsSubmitting] = useState(false)
	let [isError, setIsError] = useState(false)
	let navigate = useNavigate();
	let auth = useAuth();

	useEffect( () => {
		if(auth.user){
			navigate(loginRedirect, { replace: true });
		}
	}, [auth])

	const onFormChanged = () => {
		if(isError)
			setIsError(false)
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true)
		let formData = new FormData(event.currentTarget);
		let username = formData.get("username") as string;
		let password = formData.get("password") as string;
	
		let success = await auth.signIn(username, password)
		if(success) {
			// Send them back to the page they tried to visit when they were
			// redirected to the login page. Use { replace: true } so we don't create
			// another entry in the history stack for the login page.  This means that
			// when they get to the protected page and click the back button, they
			// won't end up back on the login page, which is also really nice for the
			// user experience.
			navigate(loginRedirect, { replace: true });
		}
		else {
			setIsError(true)
		}
		setIsSubmitting(false)

	}

	return (
		<>
			<AnimationAvatar isAnimating={isSubmitting} />
			<form onSubmit={handleSubmit} style={{marginTop: "50px"}}>
				<TextField
					label="Brukernavn" 
					name="username" 
					type="text"
					error={isError}
					onChange={onFormChanged}
					required
					fullWidth
					style={{maxWidth: "350px"}}
					autoComplete="off" />
				<br/>
				<br/>
				<TextField
					name="password"
					label="Passord"
					type="password"
					error={isError}
					onChange={onFormChanged}
					required
					fullWidth
					style={{maxWidth: "350px"}}
					autoComplete="current-password"
					/>
				<br/>
				<br/>
				{
					isError && (<><FormHelperText error={true} style={{textAlign: "center"}}>Brukernavn eller passord er feil.</FormHelperText><br/></>) 
				}
				<Button 
					variant="contained"
					size="large"
					type="submit"
					disabled={isSubmitting}
					endIcon={<LoginIcon/>}
					>Logg inn</Button>
			</form>
		</>
	)
}