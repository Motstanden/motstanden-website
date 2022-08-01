import React from 'react';

import { PageContainer } from '../../layout/PageContainer';
import { useTitle } from '../../hooks/useTitle';
import { PasswordLogin } from './PasswordLogin';

export function LoginPage() {
	useTitle("Logg inn")
	return ( 
		<PageContainer disableGutters >
			<div style={{textAlign: "center", paddingBottom: "100px"}}>
				<h1 style={{margin: "0px", paddingBlock: "20px" }}>Logg inn</h1>
				<PasswordLogin/>
			</div>
		</PageContainer>
	)
} 
