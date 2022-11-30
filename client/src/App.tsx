import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuthRouter, useAuth } from "./context/Authentication";

import { UserGroup } from 'common/enums';
import { AppLayout } from './layout/AppLayout';

// URL routes
// -- Events --
import { EventContext, EventItemContext } from './routes/event/Context';
const EditEventPage = lazy(() => import("./routes/event/EditPage"))
const ItemPage = lazy(() => import("./routes/event/ItemPage"))
const EventListPage = lazy(() => import('./routes/event/ListPage'))
const NewEventPage = lazy(() => import('./routes/event/NewPage'))

// -- User pages --
import { UserContext, UserProfileContext } from './routes/user/Context';
const EditUserPage = lazy(() => import('./routes/user/EditPage'))
const UserListPage = lazy(() => import('./routes/user/ListPage'))
const NewUserPage = lazy(() => import('./routes/user/NewPage'))
const UserPage = lazy(() => import('./routes/user/UserPage'))

// -- Other --
import { LyricItemPage, LyricListPage, LyricPageContainer } from './routes/lyric/Lyric';

import { RumourContext } from './routes/rumour/Context';
import { NewRumourPage, RumourPage } from './routes/rumour/RumourPage';

import { QuotesContext } from './routes/quotes/Context';
const QuoteListPage = lazy(() => import('./routes/quotes/ListPage'))
const NewQuotePage = lazy(() => import("./routes/quotes/NewPage"))

import { SheetArchiveContext } from "./routes/sheetArchive/Context";
const InstrumentPage = lazy(() => import("./routes/sheetArchive/InstrumentPage"))
const SongPage = lazy(() => import('./routes/sheetArchive/SongPage'))

// Lazy loaded pages
const FrontPage = lazy(() => import('./routes/frontPage/FrontPage'));
const LoginPage = lazy(() => import('./routes/login/Login'))
const BecomeMemberPage = lazy(() => import('./routes/becomeMember/BecomeMember'))
const AdminPage = lazy(() => import('./routes/admin/Admin'))
const SuperAdminPage = lazy(() => import('./routes/admin/SuperAdmin'))
const DocumentsPage = lazy(() => import('./routes/documents/DocumentsPage'))
const Home = lazy(() => import('./routes/home/Home'))
const NotFound = lazy(() => import( './routes/notFound/NotFound'))
const LicenseOnlyPage = lazy(() => import("./routes/license/LicensePage").then( module => ({default: module.LicenseOnlyPage})))
const LicensePage = lazy(() => import('./routes/license/LicensePage').then( module => ({default: module.LicensePage})))

function App() {
	const auth = useAuth()

	return (
		<div className='App' style={{ minHeight: "100vh", height: "100%" }}>
			<Routes>
				<Route element={<AppLayout />}>

					<Route path="/" element={auth.user ? <Home /> : <FrontPage/>} />

					{/* Routes that are publicly available */}
					<Route path="/framside" element={<FrontPage />} />
					<Route path="/logg-inn" element={<LoginPage />} />
					<Route path="/studenttraller" element={<LyricPageContainer />}>
						<Route index element={<LyricListPage />} />
						<Route path=":title" element={<LyricItemPage />} />
					</Route>
					<Route path="/dokumenter" element={<DocumentsPage />} />
					<Route path="/bli-medlem" element={<BecomeMemberPage />} />
					<Route path="/lisens" element={<LicensePage />} />
					<Route path="/maakesodd" element={<LicenseOnlyPage />} />

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Contributor} />}>
						<Route path="/hjem" element={<Home />} />
						<Route path="/notearkiv" element={<SheetArchiveContext />}>
							<Route path="" element={<Navigate to="repertoar" />} />
							<Route path="repertoar" element={<SongPage mode='repertoire' />} />
							<Route path="repertoar/:title" element={<InstrumentPage />} />
							<Route path="alle" element={<SongPage />} />
							<Route path="alle/:title" element={<InstrumentPage />} />
						</Route>
						<Route path="/sitater" element={<QuotesContext />}>
							<Route index element={<QuoteListPage />} />
							<Route path='ny' element={<NewQuotePage />} />
						</Route>
						<Route path="/rykter" element={<RumourContext />}>
							<Route index element={<RumourPage />} />
							<Route path="ny" element={<NewRumourPage />} />
						</Route>
						<Route path="/medlem" element={<UserContext />}>
							<Route path="" element={<Navigate to="liste" />} />
							<Route path="liste" element={<UserListPage />} />
							<Route path=":userId" element={<UserProfileContext />}>
								<Route index element={<UserPage />} />
								<Route path="rediger" element={<EditUserPage />} /> {/* Authorization to this path is handled internally by EditUserPage. */}
							</Route>
							<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator} />}>
								<Route path="ny" element={<NewUserPage />} />
							</Route>
						</Route>
						<Route path="/arrangement" element={<EventContext />}>
							<Route path="" element={<Navigate to="kommende" />} />
							<Route path=':eventId' element={<EventItemContext />} /> 	{/* Will redirect to correct path */}
							<Route path="kommende" element={<EventListPage mode='upcoming' />} />
							<Route path="kommende/:eventId" element={<EventItemContext />}>
								<Route index element={<ItemPage />} />
								<Route path="rediger" element={<EditEventPage />} />
							</Route>
							<Route path="tidligere" element={<EventListPage mode='previous' />} />
							<Route path="tidligere/:eventId" element={<EventItemContext />}>
								<Route index element={<ItemPage />} />
								<Route path="rediger" element={<EditEventPage />} />
							</Route>
							<Route path="ny" element={<NewEventPage />} />
						</Route>
					</Route>

					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Administrator} />}>
						<Route path="/admin" element={<AdminPage />} />
					</Route>

					<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator} />}>
						<Route path="/super-admin" element={<SuperAdminPage />} />
					</Route>

					{/* 404: no matching routes */}
					<Route path="/*" element={<NotFound />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App
