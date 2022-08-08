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

export function UserListPage() {
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
            <UserTable users={actualUsers}/>
            <Divider sx={{mt: "60px", mb: "40px"}}>
            </Divider>
            <h1>Styrebrukere</h1>
            <UserTable users={boardUsers}/>
        </PageContainer>
    )
}


function UserTable({users}: {users: User[]}){
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell>Navn</TableCell>
                        <TableCell>Rang</TableCell>
                        <TableCell>E-post</TableCell>
                        <TableCell>Rolle</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { users.map( (user) => (
                        <TableRow sx={rowStyle} key={user.email}>
                            <TableCell>
                                {getFullName(user)}
                            </TableCell>
                            <TableCell>
                                {userRankToPrettyStr(user.rank)}
                            </TableCell>
                            <TableCell>
                                {user.email}
                            </TableCell>
                            <TableCell>
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