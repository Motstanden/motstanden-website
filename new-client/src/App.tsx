import React, { useContext, useState } from 'react';
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { getSongLyricTitles } from "./songLyricDebug"
import { RequireAuth, useAuth }  from "./Authentication"

function App() {


	return (
		<div className='App'>
			<header/>
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="about" element={<About />} />
					<Route path="studenttraller" element={<SongLyrics/>}>
						<Route index element={<h2>Not found</h2>}/>
						<Route path=":songTitle" element={<SongLyricItem/>}/>
					</Route>
					<Route 
						path='/private' 
						element={
							<RequireAuth>
								<PrivatePage/>
							</RequireAuth>
						}
					/>
					<Route path='/logg-inn' element={ <LoginPage/> }/>
					<Route path="*" element={<NoMatch/>} />
				</Routes>
			</main>
			<footer/>
		</div>	
	);
}

function PrivatePage(){
	let auth = useAuth()
	let navigate = useNavigate()
	return (
		<>
			<h3>Private</h3>
			<p>Velkommen {auth.user}</p>
			<br/>
			<button onClick={() => {
				auth.signOut( () => navigate("/") )
			}}>Logg ut
			</button>
		</>
	)
}

// App.js
function Home() {
	let auth = useAuth();
	return (
	  <>
		<h2>Welcome to the homepage!</h2>
		<p>You can do this, I believe in you.</p>
		<nav>
		  <Link to="/about">About</Link> |{" "}
		  <Link to="/studenttraller">Studenttraller</Link>  |{" "}
		  <Link to="/private">Private</Link>
		</nav>
	  </>
	);
  }
  
function About() {
	return (
	  <>
		<h2>Who are we?</h2>
		<p>
		That feels like an existential question, don't you
		think?
		</p>
		<nav>
		  <Link to="/">Home</Link>
		</nav>
	  </>
	);
}

function SongLyrics(){
	const [songLyrics, setSongLyrics] = useState(getSongLyricTitles())
	console.log(songLyrics)
	return (
		<>
			<h2>Studenttraller</h2>
			<ul>
				{ songLyrics.map( song => (
					<li key={song.id}>
						<Link to={`/studenttraller/${song.relativeUrl}`}>{song.title}</Link>
					</li>
				))}
			</ul>
			<Outlet/>
		</>
	)
}

function NoMatch(){
	return (
		<>
			<main>
				<h2>404: Could not find a match for this url.</h2>
				<p>
					Go back to <Link to="/">Home</Link>
				</p>
			</main>
		</>
	)
}

function SongLyricItem(){
	let params = useParams();

	return (
		<>
			<h2>Note {params.songTitle}</h2>
		</>
	)
}

type LocationProps = {
	state: {
	  from: Location;
	};
  };

function LoginPage() {
	let navigate = useNavigate();
	let location = useLocation() as unknown as LocationProps;
	let auth = useAuth();
  
	let from = location.state?.from?.pathname || "/";
  
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
		<p>You must log in to view the page at {from}</p>
  
		<form onSubmit={handleSubmit}>
		  <label>
			Username: <input name="username" type="text" />
		  </label>{" "}
		  <button type="submit">Login</button>
		</form>
	  </div>
	);
  }

export default App
	