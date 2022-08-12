import { Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { User } from "common/interfaces";
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils";
import dayjs from "dayjs";
import { Navigate, useOutletContext, useParams } from "react-router-dom";

export function UserPage() {
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
            <Divider sx={{mt: 2, mb: 2}}/>
            <ProfileInfo user={user}/>
        </>
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

function ProfileInfo( {user}: {user: User}){
    const fullName = getFullName(user)
    return (
        <Grid container alignItems="top" spacing={4}>
            <Grid item xs={12} sm={6} >
                <InfoCard title="Personalia">
                    <CardItem label="Navn" text={getFullName(user)}/>
                    <CardItem label="Bursdag" text={formatDateStr(user.birthDate)}/>
                    <CardItem label="E-post" text={user.email}/>
                    <CardItem label="Tlf" text={ user.phoneNumber?.toString() ?? "-"}/>
                </InfoCard>
            </Grid>
            <Grid item xs={12} sm={6} >
                <InfoCard title="Medlemskap">
                    <CardItem label="Kappe" text={user.capeName ? `Den grønne ${user.capeName}` : "-"}/>
                    <CardItem label="Rang" text={userRankToPrettyStr(user.rank)}/>
                    <CardItem label="Status" text={user.status}/>
                    <CardItem label="Aktiv periode" text={formatDateInterval(user.startDate, user.endDate)}/>
                </InfoCard>
            </Grid>
            <Grid item xs={12} sm={6} >
                <InfoCard title="Brukerkonto">
                    <CardItem label="Rolle" text={userGroupToPrettyStr(user.groupName)}/>
                    <CardItem label="Laget" text={formatExactDate(user.createdAt)}/>
                    <CardItem label="Oppdatert" text={formatExactDate(user.updatedAt)}/>
                </InfoCard>
            </Grid>
        </Grid>
    )
}

function InfoCard( {title, children}: {title: string, children: React.ReactNode}) {
    return (
        <Paper sx={{p: 2, height: "100%"}} elevation={6}>
            <h3 style={{margin: 0}}>{title}</h3>
            <Divider sx={{mt: 2, mb: 3}}/>
            <Grid container>
                {children}
            </Grid>
        </Paper>
    )
}

function CardItem( { label, text }: {label: string, text: string}) {
    return (
        <>
            <Grid item xs={3} sm={12} md={3} >
                <b>{label}</b>
            </Grid>
            <Grid item xs={9} sm={12} md={9} marginBottom={2}>
                {text}
            </Grid>
        </> 
    )
}

function formatExactDate( dateStr: string): string{
    return dayjs(dateStr).format("DD MMM YYYY HH:mm:ss")
}

function formatDateStr( dateStr: string | undefined): string{
    if(!dateStr)
        return "-"
    return dayjs(dateStr).format("DD MMMM YYYY")
}

function formatDateInterval( startDate: string, endDate: string | undefined): string {
    let result = dayjs(startDate).format("MMMM YYYY") + " - "
    result += endDate ? dayjs(endDate).format("MMMM YYYY") : "dags dato"
    return result
}

function strToNumber(str: string | undefined): number | undefined {
    if(!str)
        return undefined

    if(!onlyNumbers(str))
        return undefined

    return parseInt(str)
}

function onlyNumbers(str: string): boolean {
    return /^[0-9]+$/.test(str);
}