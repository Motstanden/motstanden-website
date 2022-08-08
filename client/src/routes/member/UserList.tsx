import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { headerStyle, linkStyle, rowStyle } from 'src/assets/style/tableStyle';

import { useQuery } from "@tanstack/react-query";
import { User } from "common/interfaces";
import { getFullName, userRankToPrettyStr, userGroupToPrettyStr } from "common/utils";
import { PageContainer } from "src/layout/PageContainer";
import { fetchAsync } from "src/utils/fetchAsync";
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export function UserListPage() {

    const [showName, setShowName] = useState(true)
    const [showRank, setShowRank] = useState(true)
    const [showMail, setShowMail] = useState(false)
    const [showRole, setShowRole] = useState(false)

    const {isLoading, isError, data, error} = useQuery<User[]>(["FetchAllUsers"], () => fetchAsync<User[]>("/api/member-list") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }    
    
    const actualUsers = data.filter( user => !isMotstandenMail(user.email))
    const boardUsers = data.filter( user => isMotstandenMail(user.email))

    return (
        <PageContainer>
            <h1>Medlemsliste</h1>
            <Paper sx={{
                mb: 4, 
                pt: 2, 
                pb: 1, 
                px: 2 
            }}>
                <h4 style={{margin: "0px"}}>Filter</h4>
                <Grid container spacing={0} justifyContent="start">
                    <FilterBox label="Navn"   checked={showName} onClick={() => setShowName(!showName)}/>
                    <FilterBox label="Rang"   checked={showRank} onClick={() => setShowRank(!showRank)}/>
                    <FilterBox label="E-Post" checked={showMail} onClick={() => setShowMail(!showMail)}/>
                    <FilterBox label="Rolle"  checked={showRole} onClick={() => setShowRole(!showRole)}/>
                </Grid>
            </Paper>
            <UserTable 
                users={actualUsers}
                showName={showName}
                showRank={showRank}
                showMail={showMail}
                showRole={showRole}
            />
            <Divider sx={{mt: "60px", mb: "40px"}}/>
            <h1>Styrebrukere</h1>
            <UserTable 
                users={boardUsers}
                showName={showName}
                showRank={showRank}
                showMail={showMail}
                showRole={showRole}
            />
        </PageContainer>
    )
}

function FilterBox({ label, checked, onClick}: {label: string, checked: boolean, onClick: React.MouseEventHandler<HTMLButtonElement>}) {
    return(
        <Grid item xs={6} sm={3} md={2}>
            <FormControlLabel 
                control={<Checkbox checked={checked} onClick={onClick} />} 
                label={label}
            />
        </Grid>
    )
}

function UserTable({
    users, 
    showName, 
    showRank, 
    showMail, 
    showRole
}: {
    users: User[], 
    showName: boolean, 
    showRank: boolean, 
    showMail: boolean, 
    showRole: boolean}){

    const hideSx = {display: "none"}
    const nameSx = showName ? {} : hideSx
    const rankSx = showRank ? {} : hideSx
    const mailSx = showMail ? {} : hideSx
    const roleSx = showRole ? {} : hideSx

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell sx={nameSx} >Navn</TableCell>
                        <TableCell sx={rankSx} >Rang</TableCell>
                        <TableCell sx={mailSx} >E-post</TableCell>
                        <TableCell sx={roleSx} >Rolle</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { users.map( (user) => (
                        <TableRow sx={rowStyle} key={user.email}>
                            <TableCell sx={nameSx}>
                                {getFullName(user)}
                            </TableCell>
                            <TableCell sx={rankSx}>
                                {userRankToPrettyStr(user.rank)}
                            </TableCell>
                            <TableCell sx={mailSx}>
                                {user.email}
                            </TableCell>
                            <TableCell sx={roleSx}>
                                {userGroupToPrettyStr(user.groupName)}
                            </TableCell>
                        </TableRow>
                    ))}    
                </TableBody> 
            </Table>
        </TableContainer>
    )
}

function isMotstandenMail(email: string): boolean {
    return email.trim().toLowerCase().endsWith("@motstanden.no")
}