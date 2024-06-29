import EditIcon from '@mui/icons-material/Edit'
import {
    Divider,
    Grid,
    IconButton,
    Paper,
    SxProps,
    Tooltip
} from "@mui/material"
import { User } from "common/interfaces"
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs from "dayjs"
import { Link as RouterLink, matchPath, useLocation } from "react-router-dom"
import { PostingWall } from "src/components/PostingWall"
import { useAuthenticatedUser } from "src/context/Authentication"
import { useTimeZone } from 'src/context/TimeZone'
import { useTopScroller } from 'src/context/TopScroller'
import { useTitle } from "src/hooks/useTitle"
import { useUserProfileContext } from './Context'
import { Card, CardTextItem, CardTextList } from "./components/Card"

export default function UserPage() {
    const { viewedUser: user } = useUserProfileContext()
    useTitle(user.firstName)
    return (
        <div style={{maxWidth: "1300px"}}>
            <ProfileHeader 
                user={user} 
                sx={{
                    mb: {xs: 2, md: 2, lg: 4}
                }} />
            <Grid container alignItems="top" spacing={{xs: 2, md: 2, lg: 4}}>
                <PersonCard user={user} />
                <MemberCard user={user} />
                <AccountDetailsCard user={user} />
            </Grid>
            <Divider sx={{my: 4}} />
            <h1>Tidslinje</h1>
            <PostingWall userId={user.id} userFirstName={user.firstName}/>
        </div>
    )
}

function ProfileHeader({ user, sx }: { user: User, sx?: SxProps }) {
    const fullName = getFullName(user)
    return (
        <Paper
            elevation={6}
            style={{ textAlign: "center" }}
            sx={{ ...sx }}
        >
            <h1 style={{ paddingTop: "10px" }}>{fullName}</h1>
            <img
                src={`${window.location.origin}/${user.profilePicture}`}
                alt={`Profilbildet til ${fullName}`}
                style={{
                    width: "90%",
                    maxWidth: "300px",
                    borderRadius: "50%",
                    paddingBottom: "10px"
                }} />
        </Paper>
    )
}

function EditButton({ user }: { user: User }) {
    const {user: currentUser, isAdmin} = useAuthenticatedUser()

    const { preventNextScroll } = useTopScroller()
    const location  = useLocation()

    const isSelf = currentUser.id === user.id
    const canEdit = isSelf || isAdmin
    if (!canEdit) {
        return <></>
    }

    const onClick = () => {
        const isEditPage = matchPath("/medlem/:id/rediger", location.pathname)
        if(!isEditPage) {
            preventNextScroll(true)
        }
    }

    return (
        <div style={{ position: "relative" }}>
            <Tooltip title="Rediger Profil" >
                <IconButton
                    component={RouterLink}
                    to={`rediger`}
                    replace
                    onClick={onClick}
                    style={{
                        position: "absolute",
                        right: "0px",
                        bottom: "0px"
                    }}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </div>

    )
}

function PersonCard({ user }: { user: User }) {
    useTimeZone()
    return (
        <Card title="Personalia">
            <CardTextList>
                <CardTextItem label="Navn" text={getFullName(user)} />
                <CardTextItem label="Bursdag" text={formatDateStr(user.birthDate)} />
                <CardTextItem label="E-post" text={user.email} />
                <CardTextItem label="Tlf" text={user.phoneNumber?.toString() ?? "-"} />
            </CardTextList>
        </Card>
    )
}

function MemberCard({ user }: { user: User }) {
    useTimeZone()
    return (
        <Card title="Medlemskap">
            <CardTextList>
                <CardTextItem label="Kappe" text={user.capeName ? user.capeName : "-"} />
                <CardTextItem label="Rang" text={userRankToPrettyStr(user.rank)} />
                <CardTextItem label="Status" text={user.status} />
                <CardTextItem label="Aktiv periode" text={formatDateInterval(user.startDate, user.endDate)} />
            </CardTextList>
        </Card>
    )
}

function AccountDetailsCard({ user }: { user: User }) {
    useTimeZone()
    return (
        <Card title="Brukerkonto">
            <CardTextList>
                <CardTextItem label="Rolle" text={userGroupToPrettyStr(user.groupName)} />
                <CardTextItem label="Opprettet" text={formatExactDate(user.createdAt)} />
                <CardTextItem label="Oppdatert" text={formatExactDate(user.updatedAt)} />
            </CardTextList>
        </Card>
    )

}

function formatExactDate(dateStr: string): string {
    return dayjs.utc(dateStr).tz().format("DD MMM YYYY HH:mm:ss")
}

function formatDateStr(dateStr: string | null): string {
    if (!dateStr)
        return "-"
    return dayjs.utc(dateStr).tz().format("DD MMMM YYYY")
}

function formatDateInterval(startDate: string, endDate: string | null): string {
    let result = dayjs.utc(startDate).tz().format("MMMM YYYY") + " - "
    result += endDate ? dayjs.utc(endDate).tz().format("MMMM YYYY") : "dags dato"
    return result
}
