import React, { useContext, useState } from 'react';
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { RequireAuthRouter }  from "./context/Authentication"

// URL routes
import BecomeMember from './routes/becomeMember/BecomeMember';
import Documents from './routes/documents/Documents';
import Home from './routes/home/Home';
import { LoginPage } from './routes/login/Login';
import { LyricListPage, LyricItemPage, LyricPageContainer } from './routes/lyric/Lyric';
import NotFound from './routes/notFound/NotFound';
import Quotes from './routes/quotes/Quotes';
import FrontPage from './routes/frontPage/FrontPage';
import { InstrumentListPage, SheetArchivePageContainer, SongListPage } from './routes/sheetArchive/SheetArchive';

// Layout
import { AppLayout }from './layout/AppLayout';

function App() {


	return (
		<div className='App' style={{minHeight: "100vh", height: "100%"}}>
			<Routes>
				<Route element={<AppLayout/>}> 

					{/* Routes that are publicly available */}
					<Route path="/" element={<FrontPage/>}/>
					<Route path="/logg-inn" element={<LoginPage/>}/>
					<Route path="/studenttraller" element={<LyricPageContainer/>}>
						<Route index element={<LyricListPage/>}/>
            			<Route path=":title" element={<LyricItemPage/>}/>
        			</Route>
					<Route path="/dokumenter" element={<Documents/>}/>
					<Route path="/bli-medlem" element={<BecomeMember/>}/>

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter/>}> 
						<Route path="/hjem" element={<Home/>}/>
						<Route path="/notearkiv" element={<SheetArchivePageContainer/>}>
							<Route index element={<SongListPage/>}/>
							<Route path=":title" element={<InstrumentListPage/>}/>
						</Route>
						<Route path="/sitater" element={<Quotes/>}/>
					</Route>

					{/* 404: no matching routes */}
					<Route path="/*" element={<NotFound/>}/>
				</Route>
			</Routes>
		</div>	
	);
}

export default App
	