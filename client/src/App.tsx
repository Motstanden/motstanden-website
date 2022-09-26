import React, { useContext, useState } from 'react';
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate, Navigate } from "react-router-dom";
import { RequireAuthRouter, useAuth }  from "./context/Authentication"

// URL routes
import BecomeMember from './routes/becomeMember/BecomeMember';
import DocumentsPage from './routes/documents/DocumentsPage';
import Home from './routes/home/Home';
import { LoginPage } from './routes/login/Login';
import { LyricListPage, LyricItemPage, LyricPageContainer } from './routes/lyric/Lyric';
import NotFound from './routes/notFound/NotFound';
import QuotesPage from './routes/quotes/QuotesPage';
import FrontPage from './routes/frontPage/FrontPage';
import { InstrumentListPage, SongListPage } from './routes/sheetArchive/SheetArchive';
import { SheetArchiveContext } from "./routes/sheetArchive/Context";

// Layout
import { AppLayout }from './layout/AppLayout';
import { UserGroup } from 'common/enums';
import { AdminPage } from './routes/admin/Admin';
import { SuperAdminPage } from './routes/admin/SuperAdmin';
import { UserListPage } from './routes/user/ListPage';
import { NewUserPage } from './routes/user/NewPage';
import { EditUserPage } from './routes/user/EditPage';
import { UserContext } from './routes/user/Context';
import { UserPage, UserProfileContext } from './routes/user/UserPage';
import { EventListPage } from './routes/event/ListPage';
import { ItemPage } from "./routes/event/ItemPage";
import { EditEventPage } from "./routes/event/EditPage";
import { NewEventPage } from './routes/event/NewPage';
import { EventContext, EventItemContext } from './routes/event/Context';
import { QuotesContext } from './routes/quotes/Context';
import { NewQuotePage } from './routes/quotes/NewPage';
import { LicenseOnlyPage, LicensePage } from './routes/license/LicensePage';
import { RumourPage } from './routes/rumour/RumourPage';
import { RumourContext } from './routes/rumour/Context';

function App() {
	const auth = useAuth()

	return (
		<div className='App' style={{minHeight: "100vh", height: "100%"}}>
			<Routes>
				<Route element={<AppLayout/>}> 

					<Route path="/" element={auth.user ? <Home/> : <FrontPage/>}/>

					{/* Routes that are publicly available */}
					<Route path="/framside" element={<FrontPage/>}/>
					<Route path="/logg-inn" element={<LoginPage/>}/>
					<Route path="/studenttraller" element={<LyricPageContainer/>}>
						<Route index element={<LyricListPage/>}/>
            			<Route path=":title" element={<LyricItemPage/>}/>
        			</Route>
					<Route path="/dokumenter" element={<DocumentsPage/>}/>
					<Route path="/bli-medlem" element={<BecomeMember/>}/>
					<Route path="/lisens" element={<LicensePage/>}/>
					<Route path="/maakesodd" element={<LicenseOnlyPage/>}/>

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Contributor}/>}> 
						<Route path="/hjem" element={<Home/>}/>
						<Route path="/notearkiv" element={<SheetArchiveContext/>}>
							<Route path="" element={<Navigate to="repertoar"/>}/>
							<Route path="repertoar" element={<SongListPage mode='repertoire'/>}/>
							<Route path="repertoar/:title" element={<InstrumentListPage/>}/>
							<Route path="alle" element={<SongListPage/>}/>
							<Route path="alle/:title" element={<InstrumentListPage/>}/>
						</Route>
						<Route path="/sitater" element={<QuotesContext/>}>
							<Route index element={<QuotesPage/>}/>
							<Route path='ny' element={<NewQuotePage/>}/>
						</Route>
						<Route path="/rykter" element={<RumourContext/>}>
							<Route index element={<RumourPage/>}/>
						</Route>
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
							<Route path=""  		element={<Navigate to="kommende"/>}/>
							<Route path=':eventId' element={<EventItemContext/>}/> 	{/* Will redirect to correct path */}
							<Route path="kommende"  element={<EventListPage mode='upcoming'/>}/>
							<Route path="kommende/:eventId" element={<EventItemContext/>}>
								<Route index element={<ItemPage/>}/>
								<Route path="rediger" element={<EditEventPage/>}/>
							</Route>							
							<Route path="tidligere" element={<EventListPage mode='previous'/>}/>
							<Route path="tidligere/:eventId" element={<EventItemContext/>}>
								<Route index element={<ItemPage/>}/>
								<Route path="rediger" element={<EditEventPage/>}/>
							</Route>
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
	