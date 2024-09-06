import {
    Box,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    Link,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    Skeleton,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip
} from "@mui/material"

import { headerStyle, noVisitedLinkStyle, rowStyle } from 'src/assets/style/tableStyle'

import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import RestoreIcon from '@mui/icons-material/Restore'
import TableChartIcon from '@mui/icons-material/TableChart'
import { useQueryClient } from "@tanstack/react-query"
import { UserStatus } from "common/enums"
import { DeactivatedUser, User } from "common/interfaces"
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs from 'dayjs'
import React, { useDeferredValue, useEffect, useState } from "react"
import { Link as RouterLink } from 'react-router-dom'
import { MultiSelect } from "src/components/MultiSelect"
import { IconPopupMenu } from "src/components/menu/IconPopupMenu"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { useAppSnackBar } from 'src/context/AppSnackBar'
import { usePotentialUser } from "src/context/Authentication"
import { userReferenceQueryKey } from "src/context/UserReference"
import { useLocalStorage } from "src/hooks/useStorage"
import { useTitle } from 'src/hooks/useTitle'
import { Compare } from "src/utils/compareValue"
import { putJson } from "src/utils/postJson"
import { deactivatedUsersQueryKey, useDeactivatedUsersQuery, usersQueryKey, userUsersQuery } from "./Queries"

export default function UserListPage() {
    useTitle("Medlemsliste")
    useAppBarHeader("Medlemsliste")
    
    const { statusFilter, deferredStatusFilter, setStatusFilter } = useStatusFilter()

    const normalUsers = userUsersQuery()
    const deactivatedUsers = useDeactivatedUsersQuery()
    const users =  [
        ...( normalUsers.data ?? []), 
        ...(deactivatedUsers.data ?? [])
    ]

    const isLoading = normalUsers.isPending || deactivatedUsers.isPending 
    const isError = normalUsers.isError || deactivatedUsers.isError

    const filteredUsers = users
        .filter(user => !user.email.toLowerCase().endsWith("@motstanden.no"))
        .filter(user => deferredStatusFilter.size === 0 || deferredStatusFilter.has(user.status))
    
    if(isError) {
        return `${normalUsers.isError ? normalUsers.error : deactivatedUsers.error}`
    }

    return (
        <>
            <SelectStatus 
                value={statusFilter} 
                onChange={(value) => setStatusFilter(value)}
                sx={{
                    marginBottom: "20px",
                    width: "220px",
                    minWidth: "0px",
                }}
            />
            <UserTable
                isLoading={isLoading}
                users={filteredUsers}
            />
        </>
    )
}

function useStatusFilter() {
    const [statusFilter, setStatusFilter] = useLocalStorage<Set<UserStatus>>({
        initialValue: new Set([UserStatus.Active, UserStatus.Veteran]),
        key: "user-list-status-filter",
    })

    const deferredStatusFilter = useDeferredValue(statusFilter)

    // Remove deactivated status from filter if the curent user is suddenly not super admin
    const { isSuperAdmin } = usePotentialUser()
    useEffect(() => {
        if(!isSuperAdmin) {
            setStatusFilter(prev => {
                const newSet = new Set(prev)
                newSet.delete(UserStatus.Deactivated)
                return newSet
            })
        }
    }, [isSuperAdmin])

    return { statusFilter, deferredStatusFilter, setStatusFilter }
}

function SelectStatus({ 
    value, onChange, sx 
}: { 
    value: Set<UserStatus>, 
    onChange?: (value: Set<UserStatus>) => void, 
    sx?: SxProps 
}) {

    const { isSuperAdmin } = usePotentialUser()

    const handleChange = (newValues: UserStatus[]) => { 
        const sortedValues = newValues.sort((a, b) => compareByUserStatus(a, b, "asc"))
        onChange?.(new Set(sortedValues))
    }

    return (
        <MultiSelect
            value={Array.from(value)} 
            label="Statusfilter"
            color="secondary"
            onChange={handleChange}
            sx={sx}
            >
                <MenuItem value={UserStatus.Active}>
                    <Checkbox checked={value.has(UserStatus.Active)} color="secondary" />
                    <ListItemText primary={"Aktiv"} secondary={""}/>
                </MenuItem>

                <MenuItem value={UserStatus.Veteran}>
                    <Checkbox checked={value.has(UserStatus.Veteran)} color="secondary" />
                    <ListItemText primary={"Veteran"} secondary={""}/>
                </MenuItem>

                <MenuItem value={UserStatus.Retired}>
                    <Checkbox checked={value.has(UserStatus.Retired)} color="secondary" />
                    <ListItemText primary={"Pensjonist"} secondary={""}/>
                </MenuItem>

                <MenuItem value={UserStatus.Inactive}>
                    <Checkbox checked={value.has(UserStatus.Inactive)} color="secondary" />
                    <ListItemText primary={"Inaktiv"} secondary={""}/>
                </MenuItem>

                {isSuperAdmin && (
                    <MenuItem value={UserStatus.Deactivated}>
                        <Checkbox checked={value.has(UserStatus.Deactivated)} color="secondary" />
                        <ListItemText primary={"Deaktivert"} secondary={""}/>
                    </MenuItem>
                )}

        </MultiSelect>
    )
}

function compareByUserStatus(a: UserStatus, b: UserStatus, sortDirection: "asc" | "desc"): number { 
    const numA = userStatusToNumber(a)
    const numB = userStatusToNumber(b)
    return sortDirection === "asc" ? numA - numB : numB - numA
}

function userStatusToNumber(status: UserStatus): number { 
    switch(status) { 
        case UserStatus.Active: return 0
        case UserStatus.Veteran: return 1
        case UserStatus.Retired: return 2
        case UserStatus.Inactive: return 3
        case UserStatus.Deactivated: return 4
        default: return 5
    }
}

// The number corresponds to the index of the column in the table
enum Column {
    Name = 0,
    Rank = 1,
    CapeName = 2,
    Status = 3,
    Email = 4,
    PhoneNumber = 5,
    BirthDate = 6,
    Role = 7,
    StartDate = 8,
    EndDate = 9,
    DeactivatedAt = 10,
    RestoreUserMenu = 11,
}

function useVisibleColumns() {

    const { isSuperAdmin } = usePotentialUser()

    const [visibleColumns, setVisibleColumns] = useLocalStorage<Set<Column>>({
        key: ["user-table-column-visibility"],
        initialValue: new Set([
            Column.Name,
            Column.CapeName,
            Column.Rank,
        ]),
    })

    // Remove columns related to deactivation if the current user is suddenly not super admin anymore
    useEffect(() => {
        if(!isSuperAdmin) {
            setVisibleColumns(prev => {
                const newCols = new Set(prev)
                newCols.delete(Column.DeactivatedAt)
                newCols.delete(Column.RestoreUserMenu)
                return newCols
            })
        }
    }, [isSuperAdmin])

    const updateVisibility = (col: Column, isVisible: boolean) => {

        if(isVisible && visibleColumns.has(col)) 
            return

        if(!isVisible && !visibleColumns.has(col))
            return

        setVisibleColumns((prev) => {
            const newCols = new Set(prev);
            if (isVisible) {
                newCols.add(col);
            } else {
                newCols.delete(col);
            }
            return newCols;
        });
    };

    const toggleVisibility = (col: Column) => {
        setVisibleColumns((prev) => {
            const newCols = new Set(prev)

            if (newCols.has(col) && newCols.size > 1)
                newCols.delete(col)
            else
                newCols.add(col)

            return newCols
        })
    }   

    return { visibleColumns, toggleVisibility, updateVisibility }
}

function UserTable({
    users,
    isLoading = false,
}: {
    users: (User | DeactivatedUser)[],
    isLoading?: boolean
}) {
    const { visibleColumns, toggleVisibility, updateVisibility } = useVisibleColumns()
    const { sortedUsers, ...tableHeaderCellProps } = useSortableColumns(users)

    const hasDeactivatedUsers = users.some(user => user.status === UserStatus.Deactivated)
    if(hasDeactivatedUsers) { 
        updateVisibility(Column.RestoreUserMenu, true)
    } else if(!hasDeactivatedUsers) { 
        updateVisibility(Column.RestoreUserMenu, false)
    }

    const deferredVisibleColumns = useDeferredValue(visibleColumns)     // We defer changes because it can be expensive to update the table
    const lastCol = visibleColumns.size === 0
        ? undefined
        : Math.max(...visibleColumns) satisfies Column
        
    const getHeaderProps = (col: Column): TableCellProps => ({
        sx: deferredVisibleColumns.has(col) ? {} : { display: "none" },
    })

    const getRowProps = (col: Column): TableCellProps => ({
        sx: deferredVisibleColumns.has(col) ? {} : { display: "none" },
        colSpan: col === lastCol ? 2 : 1,
    })


    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={headerStyle}>
                    <TableRow>
                        <TableHeaderCell value={Column.Name} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Navn
                        </TableHeaderCell>
                        {/* <TableCell {...getHeaderProps(Column.Name)}>Navn</TableCell> */}
                        <TableCell {...getHeaderProps(Column.Rank)}>Rang</TableCell>
                        <TableCell {...getHeaderProps(Column.CapeName)}>Kappe</TableCell>
                        <TableCell {...getHeaderProps(Column.Status)}>Status</TableCell>
                        <TableCell {...getHeaderProps(Column.Email)}>E-post</TableCell>
                        <TableCell {...getHeaderProps(Column.PhoneNumber)}>Tlf.</TableCell>
                        <TableCell {...getHeaderProps(Column.BirthDate)}>Bursdag</TableCell>
                        <TableCell {...getHeaderProps(Column.Role)}>Rolle</TableCell>
                        <TableCell {...getHeaderProps(Column.StartDate)}>Start</TableCell>
                        <TableCell {...getHeaderProps(Column.EndDate)}>Slutt</TableCell>
                        <TableCell {...getHeaderProps(Column.DeactivatedAt)}>Deaktivert</TableCell>
                        <TableCell
                            align="right"
                            padding="none"
                            sx={{ whiteSpace: "nowrap", paddingRight: "5px" }}
                        > 
                            <EmailButton users={users} sx={{ marginRight: "-7px" }} />
                            <ChangeVisibilityButton
                                visibleColumns={visibleColumns}
                                toggleVisibility={toggleVisibility}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {!isLoading && sortedUsers.map((user) => (
                        <TableRow sx={rowStyle} key={user.email}>
                            <TableCell colSpan={lastCol === Column.Name ? 2 : 1}>
                                 { user.status === UserStatus.Deactivated && getFullName(user)}
                                 { user.status !== UserStatus.Deactivated && (
                                    <Link
                                        component={RouterLink}
                                        to={`/brukere/${user.id}`}
                                        underline="hover"
                                        sx={noVisitedLinkStyle}
                                    >
                                        {getFullName(user)}
                                    </Link>
                                 )}
                            </TableCell>
                            <TableCell {...getRowProps(Column.Rank)}>
                                {userRankToPrettyStr(user.rank)}
                            </TableCell>
                            <TableCell {...getRowProps(Column.CapeName)}>
                                {user.capeName ? user.capeName : "-"}
                            </TableCell>
                            <TableCell {...getRowProps(Column.Status)}>
                                {user.status}
                            </TableCell>
                            <TableCell {...getRowProps(Column.Email)}>
                                {user.email}
                            </TableCell>
                            <TableCell {...getRowProps(Column.PhoneNumber)}>
                                {user.phoneNumber ? user.phoneNumber : "-"}
                            </TableCell>
                            <TableCell {...getRowProps(Column.BirthDate)}>
                                {formatDate(user.birthDate)}
                            </TableCell>
                            <TableCell {...getRowProps(Column.Role)}>
                                {userGroupToPrettyStr(user.groupName)}
                            </TableCell>
                            <TableCell {...getRowProps(Column.StartDate)}>
                                {formatDate(user.startDate)}
                            </TableCell>
                            <TableCell {...getRowProps(Column.EndDate)}>
                                {formatDate(user.endDate)}
                            </TableCell>
                            <TableCell {...getRowProps(Column.DeactivatedAt)}>
                                 {"deactivatedAt" in user === false && "-"}
                                 {"deactivatedAt" in user === true && (
                                    <span>
                                        <span style={{whiteSpace: "nowrap"}}>
                                            {dayjs.utc(user.deactivatedAt).tz().format("DD MMM YYYY")}
                                        </span>
                                        {" "}
                                        <span style={{whiteSpace: "nowrap"}}>
                                            {dayjs.utc(user.deactivatedAt).tz().format("[kl]: HH:mm:ss")}
                                        </span>
                                    </span>
                                 )}
                            </TableCell>
                            <TableCell
                                align="right"
                                padding="none" 
                                sx={{
                                    display: visibleColumns.has(Column.RestoreUserMenu) ? "table-cell" : "none",
                                    paddingRight: "5px",
                                }}>
                                { user.status === UserStatus.Deactivated && <UserRowMenu user={user} />}
                            </TableCell>
                        </TableRow>
                    ))}

                    {isLoading && Array(40).fill(1).map((_, index) => (
                        <TableRow sx={rowStyle} key={index}>
                            <TableCell colSpan={visibleColumns.size + 1}>
                                <Skeleton variant="text" width="100%" />
                            </TableCell>
                        </TableRow>
                    ))}

                    {!isLoading && users.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={visibleColumns.size + 1} sx={{ textAlign: "center" }}>
                                <Box sx={{
                                    color: theme => theme.palette.text.disabled,
                                }}>
                                    Ingen brukere...
                                </Box>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

type SortDirection = "asc" | "desc"

type SortableColumnProps = {
    sortedUsers: (User | DeactivatedUser)[],
    sortedColumn: Column,
    sortDirection: SortDirection,
    onClick: (column: Column) => void
}

function useSortableColumns(users: (User | DeactivatedUser)[]): SortableColumnProps { 

    const [sortedColumn, setSortedColumn] = useState<Column>(Column.Name)
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

    const onClick = (column: Column) => { 
        if(column === sortedColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortedColumn(column)
            if(column === Column.Name || column === Column.CapeName || column === Column.Email) {
                setSortDirection("asc")
            } else {
                setSortDirection("desc")
            }
        }
    }

    const sortedUsers = [...users]
    if(sortedColumn === Column.Name) { 
        sortedUsers.sort((a, b) => Compare.alphanum(getFullName(a), getFullName(b), sortDirection))
    }

    return {
        sortedUsers,
        onClick,
        sortDirection,
        sortedColumn
    }
}  

type TableHeaderCellProps = Omit<SortableColumnProps, "sortedUsers"> & {
    value: Column,
    visibleColumns: Set<Column>,
    children?: React.ReactNode
}

function TableHeaderCell( { 
    value, 
    visibleColumns, 
    onClick,
    sortDirection,
    sortedColumn, 
    children 
}: TableHeaderCellProps) { 
    return (
        <TableCell 
            sx={{
                display: visibleColumns.has(value) ? "table-cell" : "none",
            }}
        >
            <TableSortLabel
                active={sortedColumn === value}
                direction={sortDirection}
                onClick={() => onClick?.(value)}
                >
                {children}
            </TableSortLabel>
        </TableCell>
    )
}


function ChangeVisibilityButton({ visibleColumns, toggleVisibility }: { visibleColumns: Set<Column>, toggleVisibility: (col: Column) => void }) {

    const { isSuperAdmin } = usePotentialUser()

    const handleClick = (e: React.MouseEvent<Element> | React.TouchEvent<Element>) => {
        e.stopPropagation()     // Prevent IconPopupMenu from closing
    }

    const handleChange = (col: Column) => {
        toggleVisibility(col)
    }

    const getProps = (col: Column): ColumnCheckboxProps => ({
        checked: visibleColumns.has(col),
        onChange: () => handleChange(col),
        onClick: handleClick,
        onTouchEnd: handleClick
    })

    return (
        <IconPopupMenu 
            icon={(
                <Tooltip title="Endre hvilke kolonner som vies i tabellen">
                    <TableChartIcon />
                </Tooltip>
            )}>
            <div style={{
                paddingInline: "15px",
                paddingTop: "10px",
                paddingBottom: "20px",
                minWidth: "180px"
            }}>
                <h3 style={{
                    margin: "0px",
                    marginBottom: "10px"
                }}>
                    Vis kolonner
                </h3>
                <Divider/>
                <Grid container
                    sx={{
                        maxWidth: "300px",
                        marginTop: "10px",
                    }}>
                    <ColumnCheckbox label="Rang" {...getProps(Column.Rank)} />
                    <ColumnCheckbox label="Bursdag" {...getProps(Column.BirthDate)} />
                    <ColumnCheckbox label="Kappe" {...getProps(Column.CapeName)} />
                    <ColumnCheckbox label="Rolle" {...getProps(Column.Role)} />
                    <ColumnCheckbox label="Status" {...getProps(Column.Status)} />
                    <ColumnCheckbox label="Start" {...getProps(Column.StartDate)} />
                    <ColumnCheckbox label="E-post" {...getProps(Column.Email)} />
                    <ColumnCheckbox label="Slutt" {...getProps(Column.EndDate)} />
                    <ColumnCheckbox label="Tlf." {...getProps(Column.PhoneNumber)} />
                    {isSuperAdmin && <ColumnCheckbox label="Deaktivert" {...getProps(Column.DeactivatedAt)} /> }
                </Grid>
            </div>
        </IconPopupMenu>
    )
}

type ColumnCheckboxProps = {
    label?: string,
    checked?: boolean,
    onChange?: () => void
    onClick?: React.MouseEventHandler<Element>,
    onTouchEnd?: React.TouchEventHandler<Element>,
}

function ColumnCheckbox({ label, checked, onChange, onClick, onTouchEnd }: ColumnCheckboxProps) {
    return (
        <Grid item xs={6}>
            <FormControlLabel
                onClick={onClick}
                onChange={onChange}
                onTouchEnd={onTouchEnd}
                label={label}
                control={
                    <Checkbox
                        checked={checked}
                        color="secondary"
                        onTouchEnd={onTouchEnd}
                    />}
            />
        </Grid>
    )
}

function EmailButton({ users, sx }: { users: User[], sx?: SxProps }) {
    const emailList = users.map(user => user.email).join(",")
    return (
        <IconButton
            sx={sx}
            disabled={users.length <= 0}
            href={`mailto:${emailList}`}
            target="_blank"
            rel="noopener noreferrer"
            LinkComponent="a"
        >
            <Tooltip title="Send e-post til brukerne som nå vises i tabellen">
                <ForwardToInboxIcon />
            </Tooltip>
        </IconButton>
    )
}

function UserRowMenu({ user }: { user: DeactivatedUser | User }) { 

    const [ isPosting, setIsPosting ] = useState(false)
    const showSnackBar = useAppSnackBar()

    const queryClient = useQueryClient()

    const onClick = async () => {
        setIsPosting(true)

        const res = await putJson(`/api/users/deactivated/${user.id}`, {}, {
            confirmText: `Er du sikker på at du vil gjenopprette brukeren til ${user.firstName}?`,
        })

        if(res?.ok) {
            queryClient.invalidateQueries({queryKey: userReferenceQueryKey})
            await Promise.all([
                queryClient.invalidateQueries({queryKey: usersQueryKey}),
                queryClient.invalidateQueries({queryKey: deactivatedUsersQueryKey}),
            ])

            showSnackBar({
                severity: "success",
                title: "Bruker gjenopprettet",
                message: `Brukeren til ${user.firstName} har blitt gjenopprettet.`,
                messageDetails: `${user.firstName} har blitt varslet på e-post.`,
                autoHideDuration: null
            })
        } 
        else if(res !== undefined) {
            showSnackBar({
                severity: "error",
                title: "Uventet feil",
                message: `Kunne ikke gjenopprette brukeren til ${user.firstName}.`,
                messageDetails: "Si ifra til webansvarlig hvis problemet vedvarer.",
                autoHideDuration: null
            })
        }

        setIsPosting(false)
    }

    if((isPosting)) {
        return (
            <CircularProgress size="19px" color="secondary" sx={{ marginRight: "11px"}} />
        )
    }

    return(
        <IconPopupMenu>
            <MenuItem 
                onClick={onClick}
                style={{ 
                    minHeight: "50px", 
                    minWidth: "180px" 
                }}>
                <ListItemIcon>
                    <RestoreIcon/>
                </ListItemIcon>
                <ListItemText>
                    Gjenopprett bruker
                </ListItemText>
            </MenuItem>
        </IconPopupMenu>
    )
}


function formatDate(dateStr: string | null) {
    return dateStr ? dayjs.utc(dateStr).tz().format("MMM YYYY") : "-"
}
