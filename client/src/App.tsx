import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { RequireAuth, RequireAuthRouter, usePotentialUser } from "src/context/Authentication";

import { UserGroup } from 'common/enums';
import { AppLayout } from 'src/layout/AppLayout';

// URL routes
// -- Event pages --
import { EventContext, EventItemContext } from 'src/routes/event/Context';
import EditEventPage from "src/routes/event/EditPage";
import EventItemPage from "src/routes/event/ItemPage";
import EventListPage from "src/routes/event/ListPage";
import NewEventPage from "src/routes/event/NewPage";

// -- User pages --
import { UserContext, UserProfileContext } from 'src/routes/user/Context';
import EditUserPage from "src/routes/user/EditPage";
import UserListPage from "src/routes/user/ListPage";
import NewUserPage from "src/routes/user/NewPage";
import UserPage from "src/routes/user/UserPage";

// -- Image pages --
import NewImageAlbumPage from "src/routes/images/NewPage";
import ImageAlbumListPage from "./routes/images/AlbumListPage";
import ImageAlbumItemPage from "./routes/images/AlbumPage";
import {
	AlbumContext as ImageAlbumItemContext,
	AlbumListContext as ImageAlbumListContext
} from "./routes/images/Context";

// -- Other pages --
import AdminPage from "src/routes/admin/Admin";
import SuperAdminPage from "src/routes/admin/SuperAdmin";
import BecomeMemberPage from "src/routes/becomeMember/BecomeMember";
import BoardWebsiteListPage from "src/routes/boardWebsiteList/BoardWebsiteList";
import DocumentsPage from "src/routes/documents/DocumentsPage";
import { FaqPage } from "src/routes/faq/FaqPage";
import FrontPage from "src/routes/frontPage/FrontPage";
import HomePage from "src/routes/home/Home";
import WallPage from "src/routes/home/Wall";
import { WallPostItemPage } from "src/routes/home/WallPostItem";
import HomePageContainer from "src/routes/home/components/PageContainer";
import { LicenseOnlyPage, LicensePage } from "src/routes/license/LicensePage";
import LoginPage from "src/routes/login/Login";
import { EditLyricPage } from "src/routes/lyric/EditPage";
import { LyricItemPage } from 'src/routes/lyric/ItemPage';
import { LyricListPage } from 'src/routes/lyric/ListPage';
import { NewLyricPage } from "src/routes/lyric/NewPage";
import NotFound from "src/routes/notFound/NotFound";
import { PollContext } from "src/routes/poll/Context";
import CurrentPollPage from "src/routes/poll/CurrentPollPage";
import NewPollPage from "src/routes/poll/NewPage";
import { QuotesContext } from 'src/routes/quotes/Context';
import QuoteListPage from "src/routes/quotes/ListPage";
import NewQuotePage from "src/routes/quotes/NewPage";
import { RumourContext } from 'src/routes/rumour/Context';
import { RumourPage } from 'src/routes/rumour/RumourPage';
import { InstrumentContext, SheetArchiveContext } from "src/routes/sheetArchive/Context";
import { InstrumentPage } from "src/routes/sheetArchive/InstrumentPage";
import SongPage from "src/routes/sheetArchive/SongPage";
import { HistoryPage } from "./routes/history/HistoryPage";
import { LyricContext, LyricItemContext } from "./routes/lyric/Context";
import { AllPollsPage } from "./routes/poll/AllPollsPage";
import { PollItemPage } from "./routes/poll/PollItemPage";
import { NewRumourPage } from "./routes/rumour/NewPage";

function App() {
	const { isLoggedIn } = usePotentialUser()

	return (
		<div className='App' style={{ minHeight: "100vh", height: "100%" }}>
			<Routes>
				<Route element={<AppLayout />}>


					{/* Routes that are publicly available */}
					<Route element={<Outlet/>}>
						<Route path="/framside" element={<FrontPage />} />
						<Route path="/logg-inn" element={<LoginPage />} />
						<Route path="/studenttraller" element={<LyricContext/>}>
							<Route path="" element={<Navigate to="populaere" replace />} />
							<Route path="populaere" element={<LyricListPage filterPopular/>}/>
							<Route path="populaere/:title" element={<LyricItemContext/>}>
								<Route index element={<LyricItemPage />} />
								<Route path="rediger" element={<RequireAuth><EditLyricPage/></RequireAuth>} />
							</Route>
							<Route path="alle" element={<LyricListPage />} />
							<Route path="alle/:title" element={<LyricItemContext/>}>
								<Route index element={<LyricItemPage />} />
								<Route path="rediger" element={<RequireAuth><EditLyricPage/></RequireAuth>} />
							</Route>
							<Route path="ny" element={<RequireAuth><NewLyricPage/></RequireAuth>}/>
							<Route path=":songId" element={<LyricItemContext/>}>
								<Route index element={<LyricItemPage />} />
								<Route path="rediger" element={<RequireAuth><EditLyricPage/></RequireAuth>} />
							</Route>
						</Route>
						<Route path="/dokumenter" element={<DocumentsPage />} />
						<Route path="/bli-medlem" element={<BecomeMemberPage />} />
						<Route path="/historie" element={<HistoryPage/>} />
						<Route path="/faq" element={<FaqPage/>} />
						<Route path="/styrets-nettsider" element={<BoardWebsiteListPage/>} />
						<Route path="/lisens" element={<LicensePage />} />
						<Route path="/maakesodd" element={<LicenseOnlyPage />} />
					</Route>

					{!isLoggedIn && (
						<Route path="/" element={<FrontPage/>} />
					)} 

					<Route element={<RequireAuthRouter/>}> 
						<Route path="/" element={<HomePageContainer />}>
							<Route path="" element={<HomePage />} />
							<Route path="hjem" element={<HomePage />} />
							<Route path="vegg" element={<WallPage />} />
							<Route path="vegg/:postId" element={<WallPostItemPage/>}/>
						</Route>
					</Route>

					{/* Routes that requires the user to be logged in */}
					<Route element={<RequireAuthRouter/>}>
						<Route path="/notearkiv" element={<SheetArchiveContext />}>
							<Route path="" element={<Navigate to="repertoar" replace />} />
							<Route path="repertoar" element={<SongPage mode='repertoire' />}/>
							<Route path="repertoar/:title" element={<InstrumentContext/>}>
								<Route index element={<InstrumentPage />} />
							</Route>
							<Route path="alle" element={<SongPage />}/>
							<Route path="alle/:title" element={<InstrumentContext/>}>
								<Route index element={<InstrumentPage />} />
							</Route>
						</Route>
						<Route path="/sitater" element={<QuotesContext />}>
							<Route index element={<QuoteListPage />} />
							<Route path='ny' element={<NewQuotePage />} />
						</Route>
						<Route path="/rykter" element={<RumourContext />}>
							<Route index element={<RumourPage />} />
							<Route path="ny" element={<NewRumourPage />} />
						</Route>
						<Route path="/avstemninger" element={<PollContext/>}>
							<Route index element={<Navigate to="paagaaende" replace/>}/>
							<Route path="paagaaende" element={<CurrentPollPage/>}/>
							<Route path="alle" element={<AllPollsPage/>}/>
							<Route path="ny" element={<NewPollPage/>}/>
							<Route path=":pollId" element={<PollItemPage/>}/>
						</Route>
						<Route path="/medlem" element={<UserContext />}>
							<Route path="" element={<Navigate to="liste" replace/>} />
							<Route path="liste" element={<UserListPage />} />
							<Route path=":userId" element={<UserProfileContext />}>
								<Route index element={<UserPage />} />
								<Route path="rediger" element={<EditUserPage/>} /> {/* Authorization to this path is handled internally by EditUserPage. */}
							</Route>
							<Route element={<RequireAuthRouter requiredGroup={UserGroup.SuperAdministrator} />}>
								<Route path="ny" element={<NewUserPage/>} />
							</Route>
						</Route>
						<Route path="/arrangement" element={<EventContext />}>
							<Route path="" element={<Navigate to="kommende" replace/>} />
							<Route path=':eventId' element={<EventItemContext />} /> 	{/* Will redirect to correct path */}
							<Route path="kommende" element={<EventListPage mode='upcoming' />} />
							<Route path="kommende/:eventId" element={<EventItemContext />}>
								<Route index element={<EventItemPage/>} />
								<Route path="rediger" element={<EditEventPage />} />
							</Route>
							<Route path="tidligere" element={<EventListPage mode='previous' />} />
							<Route path="tidligere/:eventId" element={<EventItemContext />}>
								<Route index element={<EventItemPage />} />
								<Route path="rediger" element={<EditEventPage />} />
							</Route>
							<Route path="ny" element={<NewEventPage/>} />
						</Route>

						<Route path="/bilder" element={<ImageAlbumListContext/>}>
							<Route index element={<ImageAlbumListPage/>}/>
							<Route path="ny" element={<NewImageAlbumPage/>} />
							<Route path=":title" element={<ImageAlbumItemContext/>}>
								<Route index element={<ImageAlbumItemPage/>}/>
							</Route>
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
