import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import EditIcon from '@mui/icons-material/Edit';
import { User } from "common/interfaces";
import { getFullName, hasGroupAccess, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils";
import dayjs from "dayjs";
import { Navigate, Outlet, useOutletContext, useParams, Link as RouterLink, useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useAuth } from "src/context/Authentication";
import { UserGroup } from "common/enums";
import { strToNumber } from "common/utils"
import { Card, CardTextItem } from "./Components";

export function UserProfileContext() {
    const users = useOutletContext<User[]>()

    const params = useParams();
    const userId = strToNumber(params.userId)
    if(!userId){
        return <Navigate to="/medlem/liste"/>
    }
    
    const user = users.find( item => item.userId === userId)

    if(!user) {
        return <Navigate to="/medlem/liste"/>
    }

    return(
        <>
            <ProfileBanner user={user}/>
            <EditButton user={user}/>
            <Divider sx={{mt: 2, mb: 2}}/>
            <Outlet context={user}/>
        </>
    )
}

export function UserPage(){
    const user = useOutletContext<User>()
    return (
        <Grid container alignItems="top" spacing={4}>
            <PersonCard user={user}/>
            <MemberCard user={user}/>
            <AccountDetailsCard user={user}/>
        </Grid>
    )
}

function ProfileBanner( {user}: {user: User}) {
    const fullName = getFullName(user)
    return (
        <Paper 
            elevation={6}
            style={{textAlign: "center"}}
        >
            <h1 style={{paddingTop: "10px"}}>{fullName}</h1>
            <img 
                src={`${window.location.origin}/${user.profilePicture}`}
                alt={`Profilbildet til ${fullName}`}
                style={{
                    width: "90%",
                    maxWidth: "300px",
                    borderRadius: "50%",
                    paddingBottom: "10px"
                }}/>
        </Paper>
    )
}

function EditButton( { user }: { user: User } ){
    const loggedInUser = useAuth().user!
    
    const isSelf = loggedInUser.userId === user.userId    
    const groupPermission = hasGroupAccess(loggedInUser, UserGroup.Administrator)
    const canEdit = isSelf || groupPermission
    if(!canEdit) {
        return <></>
    }

    return( 
        <div style={{position: "relative"}}>
            <Tooltip title="Rediger Profile" >
                <IconButton 
                    component={RouterLink} 
                    to={`/medlem/${user.userId}/rediger`} 
                    style={{
                        position: "absolute", 
                        right: "0px", 
                        bottom: "0px"
                    }}>
                    <EditIcon/>
                </IconButton>
            </Tooltip>
        </div>

    )
}

export function PersonCard( {user}: {user: User} ) {
    return (
        <Card title="Personalia">
            <CardTextItem label="Navn" text={getFullName(user)}/>
            <CardTextItem label="Bursdag" text={formatDateStr(user.birthDate)}/>
            <CardTextItem label="E-post" text={user.email}/>
            <CardTextItem label="Tlf" text={ user.phoneNumber?.toString() ?? "-"}/>
        </Card>
    )
}

export function MemberCard({user}: {user: User} ) {
    return (
        <Card title="Medlemskap">
            <CardTextItem label="Kappe" text={user.capeName ? `Den grønne ${user.capeName}` : "-"}/>
            <CardTextItem label="Rang" text={userRankToPrettyStr(user.rank)}/>
            <CardTextItem label="Status" text={user.status}/>
            <CardTextItem label="Aktiv periode" text={formatDateInterval(user.startDate, user.endDate)}/>
        </Card>
    )
}

export function AccountDetailsCard({user}: {user: User} ) {
    return (
        <Card title="Brukerkonto">
            <CardTextItem label="Rolle" text={userGroupToPrettyStr(user.groupName)}/>
            <CardTextItem label="Laget" text={formatExactDate(user.createdAt)}/>
            <CardTextItem label="Oppdatert" text={formatExactDate(user.updatedAt)}/>
        </Card>
    )

}

export function formatExactDate( dateStr: string): string{
    return dayjs(dateStr).format("DD MMM YYYY HH:mm:ss")
}

function formatDateStr( dateStr: string | null): string{
    if(!dateStr)
        return "-"
    return dayjs(dateStr).format("DD MMMM YYYY")
}

function formatDateInterval( startDate: string, endDate: string | null): string {
    let result = dayjs(startDate).format("MMMM YYYY") + " - "
    result += endDate ? dayjs(endDate).format("MMMM YYYY") : "dags dato"
    return result
}