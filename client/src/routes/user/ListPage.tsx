import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

import { headerStyle, noVisitedLinkStyle, rowStyle } from 'src/assets/style/tableStyle';

import { UserStatus } from 'common/enums';
import { User } from "common/interfaces";
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils";
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { TitleCard } from 'src/components/TitleCard';
import { useTitle } from 'src/hooks/useTitle';

export default function UserListPage() {
    useTitle("Medlemsliste")

    const [showName, setShowName] = useState(true)
    const [showRank, setShowRank] = useState(true)
    const [showCape, setShowCape] = useState(true)
    const [showStatus, setShowStatus] = useState(true)
    const [showMail, setShowMail] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    const [showBirth, setShowBirth] = useState(false)
    const [showStart, setShowStart] = useState(false)
    const [showEnd, setShowEnd] = useState(false)
    const [showRole, setShowRole] = useState(false)

    const [showBoard, setShowBoard] = useState(false)

    const data = useOutletContext<User[]>()

    const actualUsers = data.filter(user => !isMotstandenMail(user.email))
    const boardUsers = data.filter(user => isMotstandenMail(user.email))

    return (
        <>
            <h1>Medlemsliste</h1>
            <Paper sx={{
                mb: 4,
                pt: 2,
                pb: 1,
                px: 2
            }}>
                <h4 style={{margin: "0px"}}>Visning</h4>
                <Grid container spacing={0} justifyContent="start">
                    <FilterBox label="Navn"   checked={showName}    onClick={() => setShowName(!showName)}/>
                    <FilterBox label="Rang"   checked={showRank}    onClick={() => setShowRank(!showRank)}/>
                    <FilterBox label="Kappe"  checked={showCape}    onClick={() => setShowCape(!showCape)}/>
                    <FilterBox label="Status" checked={showStatus}  onClick={() => setShowStatus(!showStatus)}/>
                    <FilterBox label="E-post" checked={showMail}    onClick={() => setShowMail(!showMail)}/>
                    <FilterBox label="Tlf"     checked={showPhone}  onClick={() => setShowPhone(!showPhone)}/>
                    <FilterBox label="Bursdag" checked={showBirth}  onClick={() => setShowBirth(!showBirth)}/>
                    <FilterBox label="Start"   checked={showStart}  onClick={() => setShowStart(!showStart)}/>
                    <FilterBox label="Slutt"   checked={showEnd}    onClick={() => setShowEnd(!showEnd)}/>
                    <FilterBox label="Rolle"  checked={showRole}    onClick={() => setShowRole(!showRole)}/>
                    <FilterBox label="Styret" checked={showBoard}   onClick={() => setShowBoard(!showBoard)}/>
                </Grid>
            </Paper>
            <UserTable
                users={actualUsers}
                showName={showName}
                showRank={showRank}
                showMail={showMail}
                showRole={showRole}

                showStatus={showStatus}
                showCape={showCape}
                showStart={showStart}
                showEnd={showEnd}
                showPhone={showPhone}
                showBirth={showBirth}
            />
            {showBoard && (
                <>
                    <Divider sx={{ mt: "60px", mb: "40px" }} />
                    <h1>Styrebrukere</h1>
                    <UserTable
                        users={boardUsers}
                        showName={showName}
                        showRank={showRank}
                        showMail={showMail}
                        showRole={showRole}

                        showStatus={showStatus}
                        showCape={showCape}
                        showStart={showStart}
                        showEnd={showEnd}
                        showPhone={showPhone}
                        showBirth={showBirth}

                    />
                </>
            )}
            <Divider sx={{ mt: "60px", mb: "40px" }} />
            <EmailLists users={actualUsers}/>
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

function EmailLists( { users }: { users: User[]}) {
    const activeUsers = users.filter(user => user.status === UserStatus.Active)
    const veteranUsers = users.filter(user => user.status === UserStatus.Veteran)
    const retiredUsers = users.filter(user => user.status === UserStatus.Retired)
    const inactiveUsers = users.filter(user => user.status === UserStatus.Inactive)

    return (
        <Grid container> 
            <Grid item xs={12} sm={8} md={5} >
                <TitleCard title='E-postlister' sx={{width: "100%"}}>
                    <ul style={{paddingLeft: "30px", listStyleType: `"-"`}}>
                        <EmailListItem users={users} label="Alle"/>
                        <EmailListItem users={activeUsers} label="Aktive"/>
                        <EmailListItem users={veteranUsers} label="Veteraner"/>
                        <EmailListItem users={retiredUsers} label="Pensjonister"/>
                        <EmailListItem users={inactiveUsers} label="Inaktive"/>
                    </ul>
                </TitleCard>
            </Grid>
        </Grid>
    )
}

function EmailListItem({users, label }:{ users: User[], label: string }) {
    const [open, setOpen] = useState(false)

    const onClick = () => {
        const data = users.map((user: User) => (user.email))
                          .join("\n")
        navigator.clipboard.writeText(data);
        setOpen(true);
    }

    if(users.length <= 0){
        return <>
        </>
    }

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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message="Kopiert til skrivebord"
            />
        </li>
    )
}

function UserTable({
    users,
    showName,
    showRank,
    showCape,
    showStatus,
    showMail,
    showPhone,
    showBirth,
    showStart,
    showEnd,
    showRole,
}: {
    users: User[],
    showName: boolean,
    showRank: boolean,
    showCape: boolean,
    showStatus: boolean,
    showMail: boolean,
    showPhone: boolean,
    showBirth: boolean,
    showStart: boolean,
    showEnd: boolean
    showRole: boolean
}) {

    const hideSx = { display: "none" }
    const nameSx = showName ? {} : hideSx
    const rankSx = showRank ? {} : hideSx
    const capeSx = showCape ? {} : hideSx
    const statusSx = showStatus ? {} : hideSx
    const mailSx = showMail ? {} : hideSx
    const phoneSx = showPhone ? {} : hideSx
    const birthSx = showBirth ? {} : hideSx
    const startSx = showStart ? {} : hideSx
    const endSx = showEnd ? {} : hideSx
    const roleSx = showRole ? {} : hideSx

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableCell sx={nameSx}      >Navn</TableCell>
                        <TableCell sx={rankSx}      >Rang</TableCell>
                        <TableCell sx={capeSx}      >Kappe</TableCell>
                        <TableCell sx={statusSx}    >Status</TableCell>
                        <TableCell sx={mailSx}      >E-post</TableCell>
                        <TableCell sx={phoneSx}     >Tlf.</TableCell>
                        <TableCell sx={birthSx}     >Bursdag</TableCell>
                        <TableCell sx={startSx}     >Start</TableCell>
                        <TableCell sx={endSx}       >Slutt</TableCell>
                        <TableCell sx={roleSx}      >Rolle</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user: User) => (
                        <TableRow sx={rowStyle} key={user.email}>
                            <TableCell sx={nameSx}>
                                <Link
                                    component={RouterLink}
                                    to={`/medlem/${user.id}`}
                                    underline="hover"
                                    sx={noVisitedLinkStyle}
                                >
                                    {getFullName(user)}
                                </Link>
                            </TableCell>
                            <TableCell sx={rankSx}>
                                {userRankToPrettyStr(user.rank)}
                            </TableCell>
                            <TableCell sx={capeSx}>
                                {user.capeName ? <><i>Den grønne</i> {user.capeName}</> : <>-</>}
                            </TableCell>
                            <TableCell sx={statusSx}>
                                {user.status}
                            </TableCell>
                            <TableCell sx={mailSx}>
                                {user.email}
                            </TableCell>
                            <TableCell sx={phoneSx}>
                                {user.phoneNumber ? user.phoneNumber : "-"}
                            </TableCell>
                            <TableCell sx={birthSx}>
                                {formatDate(user.birthDate)}
                            </TableCell>
                            <TableCell sx={startSx}>
                                {formatDate(user.startDate)}
                            </TableCell>
                            <TableCell sx={endSx}>
                                {formatDate(user.endDate)}
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

function formatDate(dateStr: string | null) {
    return dateStr ? dayjs(dateStr).format("MMM YYYY") : "-"
}