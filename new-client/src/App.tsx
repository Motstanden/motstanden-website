import React, { useContext, useState } from 'react';
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { getSongLyricTitles } from "./songLyricDebug"
import { RequireAuthRouter }  from "./contextProviders/Authentication"

// URL routes
import BecomeMember from './routes/becomeMember/BecomeMember';
import Documents from './routes/documents/Documents';
import Home from './routes/home/Home';
import Login from './routes/login/Login';
import { LyricListPage, LyricItemPage, LyricPageContainer } from './routes/lyric/Lyric';
import NotFound from './routes/notFound/NotFound';
import Quotes from './routes/quotes/Quotes';
import FrontPage from './routes/frontPage/FrontPage';
import SheetArchive from './routes/sheetArchive/SheetArchive';

// Layout
import { AppLayout }from './layout/AppLayout';

function App() {


	return (
		<div className='App' style={{minHeight: "100vh", height: "100%"}}>
			<Routes>
				<Route element={<AppLayout/>}> 

					{/* Routes that are publicly available */}
					<Route path="/" element={<FrontPage/>}/>
					<Route path="/logg-inn" element={<Login/>}/>
					<Route path="/studenttraller" element={<LyricPageContainer/>}>
						<Route index element={<LyricListPage/>}/>
            			<Route path=":lyricTitle" element={<LyricItemPage/>}/>
        			</Route>
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
	