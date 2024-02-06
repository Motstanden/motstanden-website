import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from "./context/Authentication";
import './index.css';

import { CssBaseline } from '@mui/material';
import { AppBarStyleProvider } from './context/AppBarStyle';
import { AppThemeProvider } from './context/AppTheme';
import { LikeEmojiProvider } from './context/LikeEmoji';
import { LocaleProvider } from './context/Locale';
import { TimeZoneProvider } from './context/TimeZone';
import { TopScrollerProvider } from './context/TopScroller';
import { UserReferenceProvider } from './context/UserReference';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient()

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<LocaleProvider>
					<TimeZoneProvider>
						<AuthProvider>
							<UserReferenceProvider>
								<LikeEmojiProvider>
									<AppThemeProvider>
										<TopScrollerProvider>
											<AppBarStyleProvider>
												{/* Provides reasonable default css values from the material-ui framework */}
												<CssBaseline />

												<App />
											</AppBarStyleProvider>
										</TopScrollerProvider>
									</AppThemeProvider>
								</LikeEmojiProvider>
							</UserReferenceProvider>
						</AuthProvider>
					</TimeZoneProvider>
				</LocaleProvider>
			</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();