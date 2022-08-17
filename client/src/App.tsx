import React, { useContext, useState } from 'react';
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
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
import { UserGroup } from 'common/enums';
import { AdminPage } from './routes/admin/Admin';
import { SuperAdminPage } from './routes/admin/SuperAdmin';
import { UserListPage } from './routes/user/UserList';
import { NewUserPage } from './routes/user/NewUser';
import { EditUserPage } from './routes/user/EditUser';
import { UserContext } from './routes/user/UserContext';
import { UserPage, UserProfileContext } from './routes/user/UserPage';
import { EventListPage } from './routes/event/EventList';
import { NewEventPage } from './routes/event/NewEvent';
import { EventContext } from './routes/event/EventContext';

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
					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Contributor}/>}> 
						<Route path="/hjem" element={<Home/>}/>
						<Route path="/notearkiv" element={<SheetArchivePageContainer/>}>
							<Route index element={<SongListPage/>}/>
							<Route path=":title" element={<InstrumentListPage/>}/>
						</Route>
						<Route path="/sitater" element={<Quotes/>}/>
						<Route path="/medlem" element={<UserContext/>}>
							<Route path="" element={<Navigate to="liste"/>}/>
							<Route path="liste" element={<UserListPage/>}/>
							<Route path=":userId" element={<UserProfileContext/>}>
								<Route index element={<UserPage/>}/>
								<Route path="rediger" element={<EditUserPage/>}/> {/* Authorization to this path is handled internally by EditUserPage. */}
							</Route>
							<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator}/>}>
								<Route path="ny" element={<NewUserPage/>}/>
							</Route>
						</Route>
						<Route path="/arrangement" element={<EventContext/>}>
							<Route path=""  element={<EventListPage/>}/>
							<Route path="ny" element={<NewEventPage/>}/>
						</Route>
					</Route>

					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Administrator}/>}>
						<Route path="/admin" element={<AdminPage/>}/>
					</Route>

					<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator}/>}>
						<Route path="/super-admin" element={<SuperAdminPage/>}/>
					</Route>
					
					{/* 404: no matching routes */}
					<Route path="/*" element={<NotFound/>}/>
				</Route>
			</Routes>
		</div>	
	);
}

export default App
	