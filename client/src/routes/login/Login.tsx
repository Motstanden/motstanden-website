import { useState } from 'react';

import { Navigate, useLocation } from 'react-router-dom';
import { usePotentialUser } from 'src/context/Authentication';
import { useTitle } from '../../hooks/useTitle';
import { PageContainer } from '../../layout/PageContainer/PageContainer';
import { AnimationAvatar } from './AnimationAvatar';
import { EmailInfo, EmailLogin } from './EmailLogin';
import { useAppBarHeader } from 'src/context/AppBarHeader';

export default function LoginPage() {
	const [mailInfo, setMailInfo] = useState<EmailInfo | undefined>(undefined)

	useTitle("Logg inn")
	useAppBarHeader("Logg Inn")
	const { isLoggedIn } = usePotentialUser()
	const location = useLocation()

	if (isLoggedIn) {
		const to: string = location.state?.from?.pathname ?? "/hjem"
		return <Navigate to={to} state={{ from: location }} replace />
	}

	return (
		<PageContainer disableGutters >
			<div style={{
				textAlign: "center",
				paddingBottom: "100px"
			}}>
				<h1 style={{
					margin: "0px",
					paddingBlock: "20px"
				}}>
					Logg Inn
				</h1>
				<AnimationAvatar isAnimating={!!mailInfo} />
				<br />
				<br />
				{
					!mailInfo && <EmailLogin onEmailSent={e => setMailInfo(e)} />
				}
				{
					mailInfo && <EmailSent emailInfo={mailInfo} />
				}
			</div>
		</PageContainer>
	)
}

function EmailSent({ emailInfo }: { emailInfo: EmailInfo }) {

	return (
		<div>
			<p>
				E-post sendes til: <b>{emailInfo.email}</b>
			</p>
			<p>
				Verifiseringskode: <b>{emailInfo.code}</b>
			</p>
			<p>
				Sjekk spamfilter
			</p>
		</div>
	)
}
