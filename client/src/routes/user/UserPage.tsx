import EditIcon from '@mui/icons-material/Edit';
import {
    Divider,
    Grid,
    IconButton,
    Paper,
    Tooltip
} from "@mui/material";
import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { getFullName, hasGroupAccess, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils";
import dayjs from "dayjs";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { useAuth } from "src/context/Authentication";
import { useTitle } from "src/hooks/useTitle";
import { Card, CardTextItem } from "./Components";

export default function UserPage() {
    const user = useOutletContext<User>()
    useTitle(user.firstName)
    return (
        <Grid container alignItems="top" spacing={4}>
            <PersonCard user={user} />
            <MemberCard user={user} />
            <AccountDetailsCard user={user} />
        </Grid>
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
    const loggedInUser = useAuth().user!

    const isSelf = loggedInUser.userId === user.userId
    const groupPermission = hasGroupAccess(loggedInUser, UserGroup.Administrator)
    const canEdit = isSelf || groupPermission
    if (!canEdit) {
        return <></>
    }

    return (
        <div style={{ position: "relative" }}>
            <Tooltip title="Rediger Profil" >
                <IconButton
                    component={RouterLink}
                    to={`/medlem/${user.userId}/rediger`}
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
