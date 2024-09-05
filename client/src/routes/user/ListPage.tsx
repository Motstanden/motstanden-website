import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material"

import { headerStyle, noVisitedLinkStyle, rowStyle } from 'src/assets/style/tableStyle'

import { UserStatus } from 'common/enums'
import { User } from "common/interfaces"
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs from 'dayjs'
import { Link as RouterLink } from 'react-router-dom'
import { TitleCard } from 'src/components/TitleCard'
import { useAppBarHeader } from "src/context/AppBarHeader"
import { useAppSnackBar } from "src/context/AppSnackBar"
import { useLocalStorage } from "src/hooks/useStorage"
import { useTitle } from 'src/hooks/useTitle'
import { useUserListContext } from "./Context"

export default function UserListPage() {
    useTitle("Medlemsliste")
    useAppBarHeader("Medlemsliste")

    const {users, isPending} = useUserListContext()

    const actualUsers = users?.filter(user => !isMotstandenMail(user.email)) || []
    const boardUsers = users?.filter(user => isMotstandenMail(user.email)) || []
    
    return (
        <>
            <UserTable
                isLoading={isPending}
                users={actualUsers}
                stateStorageKey="url: /brukere"
            />
            <Divider sx={{ mt: "60px", mb: "40px" }} />
            <EmailLists users={actualUsers} isLoading={isPending}/>
        </>
    )
}

function FilterBox({ label, checked, onClick }: { label: string, checked: boolean, onClick: React.MouseEventHandler<HTMLButtonElement> }) {
    return (
        <Grid item xs={6} sm={3} md={2}>
            <FormControlLabel
                control={<Checkbox checked={checked} onClick={onClick} />}
                label={label}
            />
        </Grid>
    )
}

function EmailLists( { users, isLoading }: { users: User[], isLoading?: boolean}) {
    const activeUsers = users.filter(user => user.status === UserStatus.Active)
    const veteranUsers = users.filter(user => user.status === UserStatus.Veteran)
    const retiredUsers = users.filter(user => user.status === UserStatus.Retired)
    const inactiveUsers = users.filter(user => user.status === UserStatus.Inactive)

    return (
        <Grid container> 
            <Grid item xs={12} sm={8} md={5} >
                <TitleCard title='E-postlister' sx={{width: "100%"}}>

                    {isLoading && <Skeleton variant="rounded" width="100%" height="150px" />}

                    {!isLoading && (
                         <ul style={{paddingLeft: "30px", listStyleType: `"-"`}}>
                            <EmailListItem users={users} label="Alle"/>
                            <EmailListItem users={activeUsers} label="Aktive"/>
                            <EmailListItem users={veteranUsers} label="Veteraner"/>
                            <EmailListItem users={retiredUsers} label="Pensjonister"/>
                            <EmailListItem users={inactiveUsers} label="Inaktive"/>
                        </ul>
                    )}
                </TitleCard>
            </Grid>
        </Grid>
    )
}

function EmailListItem({users, label }:{ users: User[], label: string }) {

    const showSnackbar = useAppSnackBar()

    const onClick = () => {
        const data = users.map((user: User) => (user.email))
                          .join("\n")
        navigator.clipboard.writeText(data);
        showSnackbar({message: "Kopiert til utklippstavlen"})
    }

    if(users.length <= 0)
        return <></>

    return (
        <li style={{marginBottom: "10px"}}>
            <Button 
                onClick={onClick} 
                color="secondary" 
                sx={{
                    textTransform: "none", 
                    px: 1.5, 
                    minWidth: "0px"
                }}>
                {label}
            </Button>
        </li>
    )
}

// The number corresponds to the index of the column in the table
enum Columns {
    Name = 0,
    Rank = 1,
    CapeName = 2,
    Status = 3,
    Email = 4,
    PhoneNumber = 5,
    BirthDate = 6,
    StartDate = 7,
    EndDate = 8,
    Role = 9,
    DeactivatedAt = 10
}

function UserTable({
    users,
    stateStorageKey,
    variant = "activeUsers",
    isLoading = false,
}: {
    users: User[],
    stateStorageKey: string,
    variant?: "activeUsers" | "deactivatedUser",
    isLoading?: boolean 
}) {

    const [visibleColumns, setVisibleColumns] = useLocalStorage<Set<Columns>>({
        key: ["user-table-column-visibility", stateStorageKey],
        initialValue: new Set([
            Columns.Name,
            Columns.CapeName,
            Columns.Rank,
            variant === "activeUsers" ? Columns.Status : Columns.DeactivatedAt,
        ])
    })
    
    const toggleVisibility = (col: Columns) => { 
        setVisibleColumns((prev) => {
            const newCols = new Set(prev)
    
            if (newCols.has(col) && newCols.size > 1)
                newCols.delete(col)
            else
                newCols.add(col)
    
            return newCols
        })
    }

    const lastVisibleColumn = visibleColumns.size === 0 
        ? undefined 
        : Math.max(...visibleColumns) satisfies Columns

    const getHeaderProps = (col: Columns) => ({
        sx: visibleColumns.has(col) ? {} : { display: "none" }
    })

    const getRowProps = (col: Columns) => ({ 
        ...getHeaderProps(col),
        colSpan: col === lastVisibleColumn ? 2 : 1,
    })

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell {...getHeaderProps(Columns.Name)}>Navn</TableCell>
                        <TableCell {...getHeaderProps(Columns.Rank)}>Rang</TableCell>
                        <TableCell {...getHeaderProps(Columns.CapeName)}>Kappe</TableCell>
                        <TableCell {...getHeaderProps(Columns.Status)}>Status</TableCell>
                        <TableCell {...getHeaderProps(Columns.Email)}>E-post</TableCell>
                        <TableCell {...getHeaderProps(Columns.PhoneNumber)}>Tlf.</TableCell>
                        <TableCell {...getHeaderProps(Columns.BirthDate)}>Bursdag</TableCell>
                        <TableCell {...getHeaderProps(Columns.StartDate)}>Start</TableCell>
                        <TableCell {...getHeaderProps(Columns.EndDate)}>Slutt</TableCell>
                        <TableCell {...getHeaderProps(Columns.Role)}>Rolle</TableCell>
                        <TableCell align="right">
                            {/* TODO: Put menu here */}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {isLoading && Array(40).fill(1).map( (_, index) => (
                        <TableRow sx={rowStyle} key={index}>
                            <TableCell {...getRowProps(Columns.Name)}>
                                <Skeleton variant="text" width="185px" />
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Rank)}>
                                <Skeleton variant="text" width="85px"/>
                            </TableCell>
                            <TableCell {...getRowProps(Columns.CapeName)}>
                                <Skeleton variant="text" width="180px"/>
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Status)}>
                                <Skeleton variant="text" width="50px" />
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Email)}>
                                <Skeleton variant="text" width="200px"/>
                            </TableCell>
                            <TableCell {...getRowProps(Columns.PhoneNumber)}>
                                <Skeleton variant="text" width="80px" />
                            </TableCell>
                            <TableCell {...getRowProps(Columns.BirthDate)}>
                                <Skeleton variant="text" width="70px"/>
                            </TableCell>
                            <TableCell {...getRowProps(Columns.StartDate)}>
                                <Skeleton variant="text" width="70px"/>                                
                            </TableCell>
                            <TableCell {...getRowProps(Columns.EndDate)}>
                                <Skeleton variant="text" width="70px"/>
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Role)}>
                                <Skeleton variant="text" width="80px" />                                
                            </TableCell>
                        </TableRow>
                    ))}

                    {!isLoading && users.map((user: User) => (
                        <TableRow sx={rowStyle} key={user.email}>
                            <TableCell {...getRowProps(Columns.Name)}>
                                <Link
                                    component={RouterLink}
                                    to={`/brukere/${user.id}`}
                                    underline="hover"
                                    sx={noVisitedLinkStyle}
                                >
                                    {getFullName(user)}
                                </Link>
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Rank)}>
                                {userRankToPrettyStr(user.rank)}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.CapeName)}>
                                {user.capeName ? user.capeName : "-"}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Status)}>
                                {user.status}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Email)}>
                                {user.email}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.PhoneNumber)}>
                                {user.phoneNumber ? user.phoneNumber : "-"}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.BirthDate)}>
                                {formatDate(user.birthDate)}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.StartDate)}>
                                {formatDate(user.startDate)}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.EndDate)}>
                                {formatDate(user.endDate)}
                            </TableCell>
                            <TableCell {...getRowProps(Columns.Role)}>
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

function formatDate(dateStr: string | null) {
    return dateStr ? dayjs.utc(dateStr).tz().format("MMM YYYY") : "-"
}
