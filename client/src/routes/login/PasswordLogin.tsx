import LoginIcon from '@mui/icons-material/Login';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authentication';
import { AnimationAvatar } from './AnimationAvatar';


interface ILocationProps {
	state: {
		from: Location;
	}
}

export function PasswordLogin() {
	let location = useLocation() as ILocationProps;
	return (
		<PasswordLoginForm loginRedirect={location.state?.from?.pathname || "/hjem"} />
	)
}

function PasswordLoginForm({ loginRedirect }: { loginRedirect: string; }) {
	let [isSubmitting, setIsSubmitting] = useState(false);
	let [isError, setIsError] = useState(false);
	let navigate = useNavigate();
	let auth = useAuth();

	useEffect(() => {
		if (auth.user) {
			navigate(loginRedirect, { replace: true });
		}
	}, [auth]);

	const onFormChanged = () => {
		if (isError)
			setIsError(false);
	};

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		let formData = new FormData(event.currentTarget);
		let username = formData.get("username") as string;
		let password = formData.get("password") as string;

		// let success = await auth.signIn(username, password);
		const success = false
		if (success) {
			// Send them back to the page they tried to visit when they were
			// redirected to the login page. Use { replace: true } so we don't create
			// another entry in the history stack for the login page.  This means that
			// when they get to the protected page and click the back button, they
			// won't end up back on the login page, which is also really nice for the
			// user experience.
			navigate(loginRedirect, { replace: true });
		}
		else {
			setIsError(true);
		}
		setIsSubmitting(false);

	}

	return (
		<>
			<AnimationAvatar isAnimating={isSubmitting} />
			<form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
				<TextField
					label="Brukernavn"
					name="username"
					type="text"
					color="secondary"
					error={isError}
					onChange={onFormChanged}
					required
					fullWidth
					style={{ maxWidth: "min(85vw,400px)" }}
					autoComplete="off" />
				<br />
				<br />
				<TextField
					name="password"
					label="Passord"
					type="password"
					color="secondary"
					error={isError}
					onChange={onFormChanged}
					required
					fullWidth
					style={{ maxWidth: "min(85vw,400px)" }}
					autoComplete="current-password" />
				<br />
				<br />
				{
					isError && (<><FormHelperText error={true} style={{ textAlign: "center" }}>Brukernavn eller passord er feil.</FormHelperText><br /></>)
				}
				<Button
					variant="contained"
					color="secondary"
					size="large"
					type="submit"
					disabled={isSubmitting}
					endIcon={<LoginIcon />}
				>Logg inn</Button>
			</form>
		</>
	);
}
