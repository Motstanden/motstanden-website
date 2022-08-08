import React from 'react';

import { PageContainer } from '../../layout/PageContainer';
import { useTitle } from '../../hooks/useTitle';
import { EmailLogin } from './EmailLogin';
import { useAuth } from 'src/context/Authentication';
import { Navigate, useLocation } from 'react-router-dom';

export function LoginPage() {
	useTitle("Logg inn")
	const auth = useAuth()
    let location = useLocation()

	if(auth.user){
		const to = location.pathname === "/logg-inn" ? "/hjem" : location.pathname 
		return <Navigate  to={to} state={{ from: location }} replace/>
	}

	return ( 
		<PageContainer disableGutters >
			<div style={{textAlign: "center", paddingBottom: "100px"}}>
				<h1 style={{margin: "0px", paddingBlock: "20px" }}>Logg inn</h1>
				<EmailLogin/>
			</div>
		</PageContainer>
	)
} 
