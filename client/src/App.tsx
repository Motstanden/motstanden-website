import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuthRouter, useAuth } from "./context/Authentication";

// URL routes
import { UserGroup } from 'common/enums';
import { AppLayout } from './layout/AppLayout';
import { AdminPage } from './routes/admin/Admin';
import { SuperAdminPage } from './routes/admin/SuperAdmin';
import BecomeMember from './routes/becomeMember/BecomeMember';
import DocumentsPage from './routes/documents/DocumentsPage';
import { EventContext, EventItemContext } from './routes/event/Context';
import { EditEventPage } from "./routes/event/EditPage";
import { ItemPage } from "./routes/event/ItemPage";
import { EventListPage } from './routes/event/ListPage';
import { NewEventPage } from './routes/event/NewPage';
import FrontPage from './routes/frontPage/FrontPage';
import Home from './routes/home/Home';
import { LicenseOnlyPage, LicensePage } from './routes/license/LicensePage';
import { LoginPage } from './routes/login/Login';
import { LyricItemPage, LyricListPage, LyricPageContainer } from './routes/lyric/Lyric';
import NotFound from './routes/notFound/NotFound';
import { QuotesContext } from './routes/quotes/Context';
import { NewQuotePage, QuotesPage } from './routes/quotes/QuotesPage';
import { RumourContext } from './routes/rumour/Context';
import { NewRumourPage, RumourPage } from './routes/rumour/RumourPage';
import { SheetArchiveContext } from "./routes/sheetArchive/Context";
import { InstrumentListPage, SongListPage } from './routes/sheetArchive/SheetArchive';
import { UserContext } from './routes/user/Context';
import { EditUserPage } from './routes/user/EditPage';
import { UserListPage } from './routes/user/ListPage';
import { NewUserPage } from './routes/user/NewPage';
import { UserPage, UserProfileContext } from './routes/user/UserPage';

function App() {
	const auth = useAuth()

	return (
		<div className='App' style={{ minHeight: "100vh", height: "100%" }}>
			<Routes>
				<Route element={<AppLayout />}>

					<Route path="/" element={auth.user ? <Home /> : <FrontPage />} />

					{/* Routes that are publicly available */}
					<Route path="/framside" element={<FrontPage />} />
					<Route path="/logg-inn" element={<LoginPage />} />
					<Route path="/studenttraller" element={<LyricPageContainer />}>
						<Route index element={<LyricListPage />} />
						<Route path=":title" element={<LyricItemPage />} />
					</Route>
					<Route path="/dokumenter" element={<DocumentsPage />} />
					<Route path="/bli-medlem" element={<BecomeMember />} />
					<Route path="/lisens" element={<LicensePage />} />
					<Route path="/maakesodd" element={<LicenseOnlyPage />} />

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter requiredGroup={UserGroup.Contributor} />}>
						<Route path="/hjem" element={<Home />} />
						<Route path="/notearkiv" element={<SheetArchiveContext />}>
							<Route path="" element={<Navigate to="repertoar" />} />
							<Route path="repertoar" element={<SongListPage mode='repertoire' />} />
							<Route path="repertoar/:title" element={<InstrumentListPage />} />
							<Route path="alle" element={<SongListPage />} />
							<Route path="alle/:title" element={<InstrumentListPage />} />
						</Route>
						<Route path="/sitater" element={<QuotesContext />}>
							<Route index element={<QuotesPage />} />
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
