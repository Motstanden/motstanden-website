import { Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { User } from "common/interfaces";
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils";
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
            <h1>{getFullName(user)}</h1>
            <ProfileInfo user={user}/>
        </>
    )
}

function ProfileInfo( {user}: {user: User}){
    const fullName = getFullName(user)
    return (
        <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} sm={6} md={3} style={{textAlign: "center"}}>
                <img 
                    src={`${window.location.origin}/${user.profilePicture}`}
                    alt={`Profilbildet til ${fullName}`}
                    style={{
                        width: "90%",
                        maxWidth: "300px",
                        borderRadius: "50%"
                    }}/>
            </Grid>
            <Grid item xs={12} sm={6} >
                <InfoCard user={user}/>
            </Grid>
        </Grid>
    )
}

function InfoCard( {user}: {user: User} ) {
    return (
        <Paper sx={{p: 2}}>
            <h3 style={{margin: 0}}>{user.firstName}</h3>
            <Divider sx={{mt: 1, mb: 2}}/>
            <Grid container style={{maxWidth: "300px"}}>
                <CardItem label="E-post" text={user.email}/>
                <CardItem label="Rang"   text={userRankToPrettyStr(user.rank)}/>
                <CardItem label="Rolle"  text={userGroupToPrettyStr(user.groupName)}/>
            </Grid>
        </Paper>
    )
}

function CardItem({label, text}: {label: string, text: string}) {
    return (
        <>
            <Grid item xs={3} sm={12} md={3} >
                <b>{label}</b>
            </Grid>
            <Grid item xs={9} sm={12} md={9} marginBottom={1}>
                {text}
            </Grid>
        </> 
    )
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