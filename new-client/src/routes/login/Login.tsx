import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./Authentication";

type LocationProps = {
	state: {
	  from: Location;
	};
  };

export default function Login() {
	let navigate = useNavigate();
	let location = useLocation() as unknown as LocationProps;
	let auth = useAuth();

	let from = location.state?.from?.pathname || "/hjem";
	
	useEffect( () => {
		if(auth.user){
			navigate(from, { replace: true });
		}

	}, [auth])
	
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
	  event.preventDefault();

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
	}
  

	return (
	  <div>
		<h1>Logg inn</h1>
		<form onSubmit={handleSubmit}>
		  	<label htmlFor="username"><b>Brukernavn:</b></label>
			<br/> 
			<input 
				name="username" 
				type="text"
				placeholder="Brukernavn..."
				required
				autoFocus
				autoComplete="off" />
		  	<br/>
		  	<br/>
		  	<label htmlFor="password"><b>Passord:</b></label>
			<br/>
			<input 
				type="password"
				name="password"
				placeholder="passord"
				required
				/>
			<br/>
			<br/>
		  	<button type="submit">Logg inn</button>
		</form>
	  </div>
	);
  }
