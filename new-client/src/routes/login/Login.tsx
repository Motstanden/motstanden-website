import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authentication";
import { PageContainer } from "../../layout/PageContainer";

type LocationProps = {
	state: {
	  from: Location;
	};
  };

  
export default function Login() {
	let navigate = useNavigate();
	let location = useLocation() as LocationProps;
	let auth = useAuth();

	let [isSubmitting, setIsSubmitting] = useState(false)

	let from = location.state?.from?.pathname || "/hjem";
	
	useEffect( () => {
		if(auth.user){
			navigate(from, { replace: true });
		}

	}, [auth])
	
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true)
		let formData = new FormData(event.currentTarget);
		let username = formData.get("username") as string;
		let password = formData.get("password") as string;
	
		auth.signIn(username, password, () => {
			// Send them back to the page they tried to visit when they were
			// redirected to the login page. Use { replace: true } so we don't create
			// another entry in the history stack for the login page.  This means that
			// when they get to the protected page and click the back button, they
			// won't end up back on the login page, which is also really nice for the
			// user experience.
			navigate(from, { replace: true });
		});
		setIsSubmitting(false)
	}
	

	return (
	  <PageContainer>
		<h1>Logg inn</h1>
		<form onSubmit={handleSubmit}>
			<TextField
				label="Brukernavn" 
				name="username" 
				type="text"
				color="secondary"
				required
				autoFocus
				autoComplete="off" />
		  	<br/>
			<br/>
			<TextField
				name="password"
				label="Passord"
				type="password"
				color="secondary"
				required
				autoComplete="current-password"
				/>
			<br/>
			<br/>
		  	<Button 
				variant="contained"
				color="secondary"
				size="large"
				type="submit"
				disabled={isSubmitting}
				>Logg inn</Button>
		</form>
	  </PageContainer>
	);
  }
