import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./routes/login/Authentication"
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

import CssBaseline from '@mui/material/CssBaseline';
import { AppThemeProvider } from './layout/Themes';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient()

root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<AuthProvider>
					<AppThemeProvider>
						{/* Provides reasonable default css values from the material-ui framework */}
						<CssBaseline/>

						<App />
					</AppThemeProvider>
				</AuthProvider>
			</BrowserRouter>
			<ReactQueryDevtools/>
		</QueryClientProvider>
	</React.StrictMode>
);
		
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
		