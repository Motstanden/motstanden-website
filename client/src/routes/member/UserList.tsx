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

export function UserListPage () {
    return (
        <PageContainer>
            <h1>Medlemsliste</h1>
            <UserList/>
        </PageContainer>
    )
}

function UserList (){
    const {isLoading, isError, data, error} = useQuery<User[]>(["FetchAllUsers"], () => fetchAsync<User[]>("/api/member-list") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

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
                    { data.map( (user) => (
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