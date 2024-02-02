import EditIcon from '@mui/icons-material/Edit';
import {
    Divider,
    Grid,
    IconButton,
    Paper,
    Tooltip
} from "@mui/material";
import { User } from "common/interfaces";
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils";
import dayjs from "dayjs";
import { Link as RouterLink, matchPath, useLocation } from "react-router-dom";
import { PostingWall } from "src/components/PostingWall";
import { useAuthenticatedUser } from "src/context/Authentication";
import { useTopScroller } from 'src/context/TopScroller';
import { useTitle } from "src/hooks/useTitle";
import { useUserProfileContext } from './Context';
import { Card, CardTextItem } from "./components/Card";

export default function UserPage() {
    const { viewedUser: user } = useUserProfileContext()
    useTitle(user.firstName)
    return (
        <div>
            <Grid container alignItems="top" spacing={4}>
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

export function UserPageHeader( {user}: {user: User}) {
    return (
        <>
            <ProfileBanner user={user} />
            <EditButton user={user} />
            <Divider sx={{ mt: 2, mb: 2 }} />
        </>
    )
}

function ProfileBanner({ user }: { user: User }) {
    const fullName = getFullName(user)
    return (
        <Paper
            elevation={6}
            style={{ textAlign: "center" }}
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

export function PersonCard({ user }: { user: User }) {
    return (
        <Card title="Personalia">
            <CardTextItem label="Navn" text={getFullName(user)} />
            <CardTextItem label="Bursdag" text={formatDateStr(user.birthDate)} />
            <CardTextItem label="E-post" text={user.email} />
            <CardTextItem label="Tlf" text={user.phoneNumber?.toString() ?? "-"} />
        </Card>
    )
}

export function MemberCard({ user }: { user: User }) {
    return (
        <Card title="Medlemskap">
            <CardTextItem label="Kappe" text={user.capeName ? user.capeName : "-"} />
            <CardTextItem label="Rang" text={userRankToPrettyStr(user.rank)} />
            <CardTextItem label="Status" text={user.status} />
            <CardTextItem label="Aktiv periode" text={formatDateInterval(user.startDate, user.endDate)} />
        </Card>
    )
}

export function AccountDetailsCard({ user }: { user: User }) {
    return (
        <Card title="Brukerkonto">
            <CardTextItem label="Rolle" text={userGroupToPrettyStr(user.groupName)} />
            <CardTextItem label="Laget" text={formatExactDate(user.createdAt)} />
            <CardTextItem label="Oppdatert" text={formatExactDate(user.updatedAt)} />
        </Card>
    )

}

export function formatExactDate(dateStr: string): string {
    return dayjs(dateStr).utc(true).local().format("DD MMM YYYY HH:mm:ss")
}

function formatDateStr(dateStr: string | null): string {
    if (!dateStr)
        return "-"
    return dayjs(dateStr).format("DD MMMM YYYY")
}

function formatDateInterval(startDate: string, endDate: string | null): string {
    let result = dayjs(startDate).format("MMMM YYYY") + " - "
    result += endDate ? dayjs(endDate).format("MMMM YYYY") : "dags dato"
    return result
}
