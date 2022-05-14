import React, { useContext, useState } from 'react';
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { getSongLyricTitles } from "./songLyricDebug"
import { RequireAuthRouter }  from "./routes/login/Authentication"

// URL routes
import Documents from './routes/documents/Documents';
import Home from './routes/home/Home';
import Login from './routes/login/Login';
import Lyric from './routes/lyric/Lyric';
import NotFound from './routes/notFound/NotFound';
import Quotes from './routes/quotes/Quotes';
import Root from './routes/root/Root';
import SheetArchive from './routes/sheetArchive/SheetArchive';

// Layout
import PageLayout from './layout/PageLayout2';
import BecomeMember from './routes/becomeMember/BecomeMember';

function App() {


	return (
		<div className='App'>
			<Routes>
				<Route element={<PageLayout/>}> 

					{/* Routes that are publicly available */}
					<Route path="/" element={<Root/>}/>
					<Route path="/logg-inn" element={<Login/>}/>		
					<Route path="/studenttraller" element={<Lyric/>}/>
					<Route path="/dokumenter" element={<Documents/>}/>
					<Route path="/bli-medlem" element={<BecomeMember/>}/>

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter/>}> 
						<Route path="/hjem" element={<Home/>}/>
						<Route path="/notearkiv" element={<SheetArchive/>}/>
						<Route path="/sitater" element={<Quotes/>}/>
					</Route>

					{/* 404: no matching routes */}
					<Route path="/*" element={<NotFound/>}/>
				</Route>
			</Routes>
		</div>	
	);
}


function SongLyrics2(){
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

function SongLyricItem2(){
	let params = useParams();

	return (
		<>
			<h2>Note {params.songTitle}</h2>
		</>
	)
}

export default App
	