import React from "react"
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
  
	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
	  event.preventDefault();
  
	  let formData = new FormData(event.currentTarget);
	  let username = formData.get("username") as string;
  
	  auth.signIn(username, () => {
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
		  <label>
			Username: <input name="username" type="text" />
		  </label>{" "}
		  <button type="submit">Login</button>
		</form>
	  </div>
	);
  }
