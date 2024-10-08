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
import { UserGroup, UserRank, UserStatus } from "common/enums"
import { DeactivatedUser, User } from "common/interfaces"
import { getFullName, userGroupToPrettyStr, userRankToPrettyStr } from "common/utils"
import dayjs from 'dayjs'
import React, { useDeferredValue, useEffect, useState } from "react"
import { Link as RouterLink } from 'react-router-dom'
import { MultiSelect } from "src/components/MultiSelect"
import { IconPopupMenu } from "src/components/menu/IconPopupMenu"
import { useAppSnackBar } from 'src/context/AppSnackBar'
import { usePotentialUser } from "src/context/Authentication"
import { userReferenceQueryKey } from "src/context/UserReference"
import { useLocalStorage, useSessionStorage } from "src/hooks/useStorage"
import { useTitle } from 'src/hooks/useTitle'
import { Compare } from "src/utils/compareValue"
import { putJson } from "src/utils/postJson"
import { deactivatedUsersQueryKey, useDeactivatedUsersQuery, usersQueryKey, userUsersQuery } from "./Queries"

export default function UserListPage() {
    useTitle("Brukere")
    
    const { statusFilter, deferredStatusFilter, setStatusFilter } = useStatusFilter()
    const { rankFilter, deferredRankFilter, setRankFilter } = useRankFilter()
    const { groupFilter, deferredGroupFilter, setGroupFilter } = useGroupFilter()

    let showTestUsers: boolean | undefined, setShowTestUsers: React.Dispatch<React.SetStateAction<boolean>> | undefined;
    if (import.meta.env.DEV) {
        [showTestUsers, setShowTestUsers] = useState(false);
    }

    const normalUsers = userUsersQuery()
    const deactivatedUsers = useDeactivatedUsersQuery()
    const users =  [
        ...( normalUsers.data ?? []), 
        ...(deactivatedUsers.data ?? [])
    ]

    const isLoading = normalUsers.isPending || deactivatedUsers.isPending 
    const isError = normalUsers.isError || deactivatedUsers.isError

    const filteredUsers = users
        .filter(user => deferredStatusFilter.size === 0 || deferredStatusFilter.has(user.status))
        .filter(user => deferredRankFilter.size === 0 || deferredRankFilter.has(user.rank))
        .filter(user => deferredGroupFilter.size === 0 || deferredGroupFilter.has(user.groupName))
        .filter(user => {
            if(!import.meta.env.DEV ) {
                return true
            }
            if(showTestUsers) {
                return true
            }
            return !user.email.toLowerCase().endsWith("@test.motstanden.no")
        })
        
    if(isError) {
        return `${normalUsers.isError ? normalUsers.error : deactivatedUsers.error}`
    }

    return (
        <Box sx={{mt: {xs: -2, sm: -4, md: -5}}} >
            {import.meta.env.DEV && (
                <FormControlLabel 
                    label="Vis testbrukere"
                    onChange={(_e) => setShowTestUsers?.(prev => !prev)}
                    sx={{
                        my: 2
                    }}
                    control={
                        <Checkbox checked={showTestUsers} color="secondary"/>}
                />
           )}
            <Grid container 
                columnSpacing={4} 
                rowSpacing={{xs: 2, sm: 3, md: 4}}  
                sx={{
                    mb: {xs: 4, md: 2},
                    maxWidth: "1300px",
                }}
                >
                <Grid item xs={12} sm={12} md={4}>
                    <SelectStatus 
                        value={statusFilter} 
                        onChange={(value) => setStatusFilter(value)}
                        sx={{
                            height: "100%",
                            minHeight: "100%",
                            minWidth: "0px",
                            maxWidth: "400px"
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}> 
                    <SelectRank 
                        value={rankFilter} 
                        onChange={(value) => setRankFilter(value)}
                        sx={{
                            height: "100%",
                            minHeight: "100%",
                            minWidth: "0px",
                            maxWidth: "400px"
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <SelectGroup 
                        value={groupFilter} 
                        onChange={(value) => setGroupFilter(value)}
                        sx={{
                            height: "100%",
                            minHeight: "100%",
                            minWidth: "0px",
                            maxWidth: "400px"
                        }}
                        />
                </Grid>
            </Grid>
            <UserTable
                isLoading={isLoading}
                users={filteredUsers}
            />
        </Box>
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

function useRankFilter() {
    const [rankFilter, setRankFilter] = useLocalStorage<Set<UserRank>>({
        initialValue: new Set(),
        key: "user-list-rank-filter",
    })
    const deferredRankFilter = useDeferredValue(rankFilter)

    return { rankFilter, deferredRankFilter, setRankFilter }
}

function useGroupFilter() {
    const [groupFilter, setGroupFilter] = useLocalStorage<Set<UserGroup>>({
        initialValue: new Set(),
        key: "user-list-group-filter",
    })
    const deferredGroupFilter = useDeferredValue(groupFilter)

    return { groupFilter, deferredGroupFilter, setGroupFilter }
}

interface SelectFilterProps<T> {
    value: Set<T>,
    onChange?: (value: Set<T>) => void,
    sx?: SxProps
}

function SelectStatus({value, onChange, sx}: SelectFilterProps<UserStatus>) {

    const { isSuperAdmin } = usePotentialUser()

    const handleChange = (newValues: UserStatus[]) => { 
        const sortedValues = newValues.sort((a, b) => compareByUserStatus(a, b, "desc"))
        onChange?.(new Set(sortedValues))
    }

    return (
        <MultiSelect
            value={Array.from(value)} 
            label="Statusfilter"
            color="secondary"
            onChange={handleChange}
            fullWidth
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

function SelectGroup({value, onChange, sx}: SelectFilterProps<UserGroup>) { 
    const handleChange = (newValues: UserGroup[]) => { 
        const sortedValues = newValues.sort((a, b) => compareByUserRole(a, b, "asc"))
        onChange?.(new Set(sortedValues))
    }

    const groupToPrettyString = (group: UserGroup) => { 
        if(group === UserGroup.Contributor) 
            return "Ingen rolle"
        else 
            return userGroupToPrettyStr(group)
    }

    return (
        <MultiSelect
            value={Array.from(value)} 
            label="Rollefilter"
            color="secondary"
            onChange={handleChange}
            sx={sx}
            fullWidth
            prettifyValue={groupToPrettyString}
            >
                <MenuItem value={UserGroup.Contributor}>
                    <Checkbox checked={value.has(UserGroup.Contributor)} color="secondary" />
                    <ListItemText primary={groupToPrettyString(UserGroup.Contributor)}/>
                </MenuItem>
                <MenuItem value={UserGroup.Editor}>
                    <Checkbox checked={value.has(UserGroup.Editor)} color="secondary" />
                    <ListItemText primary={groupToPrettyString(UserGroup.Editor)}/>
                </MenuItem>
                <MenuItem value={UserGroup.Administrator}>
                    <Checkbox checked={value.has(UserGroup.Administrator)} color="secondary" />
                    <ListItemText primary={groupToPrettyString(UserGroup.Administrator)}/>
                </MenuItem>
                <MenuItem value={UserGroup.SuperAdministrator}>
                    <Checkbox checked={value.has(UserGroup.SuperAdministrator)} color="secondary" />
                    <ListItemText primary={groupToPrettyString(UserGroup.SuperAdministrator)}/>
                </MenuItem>
        </MultiSelect>
    )
}


function SelectRank( {value, onChange, sx}: SelectFilterProps<UserRank>) {

    const handleChange = (newValues: UserRank[]) => { 
        const sortedValues = newValues.sort((a, b) => compareByUserRank(a, b, "asc"))
        onChange?.(new Set(sortedValues))
    }

    return (
        <MultiSelect
            value={Array.from(value)} 
            label="Rangfilter"
            color="secondary"
            onChange={handleChange}
            sx={sx}
            fullWidth
            prettifyValue={userRankToPrettyStr}
            >
                <MenuItem value={UserRank.ShortCircuit}>
                    <Checkbox checked={value.has(UserRank.ShortCircuit)} color="secondary"  />
                    <ListItemText primary={userRankToPrettyStr(UserRank.ShortCircuit)}/>
                </MenuItem>

                <MenuItem value={UserRank.Ohm}>
                    <Checkbox checked={value.has(UserRank.Ohm)} color="secondary" />
                    <ListItemText primary={userRankToPrettyStr(UserRank.Ohm)}/>
                </MenuItem>

                <MenuItem value={UserRank.KiloOhm}>
                    <Checkbox checked={value.has(UserRank.KiloOhm)} color="secondary" />
                    <ListItemText primary={userRankToPrettyStr(UserRank.KiloOhm)}/>
                </MenuItem>

                <MenuItem value={UserRank.MegaOhm}>
                    <Checkbox checked={value.has(UserRank.MegaOhm)} color="secondary" />
                    <ListItemText primary={userRankToPrettyStr(UserRank.MegaOhm)}/>
                </MenuItem>

                <MenuItem value={UserRank.GigaOhm}>
                    <Checkbox checked={value.has(UserRank.GigaOhm)} color="secondary" />
                    <ListItemText primary={userRankToPrettyStr(UserRank.GigaOhm)}/>
                </MenuItem>

                <MenuItem value={UserRank.HighImpedance}>
                    <Checkbox checked={value.has(UserRank.HighImpedance)} color="secondary" />
                    <ListItemText primary={userRankToPrettyStr(UserRank.HighImpedance)}/>
                </MenuItem>
        </MultiSelect>
    )
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
        initialValue: () => {
            if(window.matchMedia("(max-width: 710px)").matches) {
                return new Set([Column.Name, Column.CapeName])
            } else if (window.matchMedia("(max-width: 850px)").matches) {
                return new Set([Column.Name, Column.Rank, Column.CapeName])
            } else if (window.matchMedia("(max-width: 1100px)").matches) {
                return new Set([Column.Name, Column.Rank, Column.CapeName, Column.StartDate])
            } else { 
                return new Set([Column.Name, Column.Rank, Column.CapeName, Column.Status, Column.StartDate,])
            }
        },
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
                        <TableHeaderCell value={Column.Rank} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Rang
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.CapeName} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Kappe
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.Status} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Status
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.Email} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            E-post
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.PhoneNumber} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Tlf.
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.BirthDate} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Bursdag
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.Role} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Rolle
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.StartDate} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Start
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.EndDate} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Slutt
                        </TableHeaderCell>
                        <TableHeaderCell value={Column.DeactivatedAt} visibleColumns={visibleColumns} {...tableHeaderCellProps}>
                            Deaktivert
                        </TableHeaderCell>
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
                                {user.birthDate ? dayjs.utc(user.birthDate).tz().format("DD MMM YYYY") : "-"}
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

    const [sortedColumn, setSortedColumn] = useSessionStorage<Column>({
        key: "user-list-sorted-column",
        initialValue: Column.Name,
    })
    const [sortDirection, setSortDirection] = useSessionStorage<SortDirection>({
        key: "user-list-sort-direction",
        initialValue: getDefaultSortDirection(Column.Name),
    })

    const onClick = (column: Column) => { 
        if(column === sortedColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortedColumn(column)
            setSortDirection(getDefaultSortDirection(column))
        }
    }

    const sortedUsers = sortUsers(users, sortedColumn, sortDirection)

    return {
        sortedUsers,
        onClick,
        sortDirection,
        sortedColumn
    }
}  

function getDefaultSortDirection(column: Column): SortDirection { 
    switch(column) { 
        case Column.Rank:
        case Column.Status:
        case Column.Role: 
            return "desc"
        default: return "asc"
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
                direction={sortedColumn === value ? sortDirection : getDefaultSortDirection(value)}
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
                    <TableChartIcon sx={{
                        color: theme => theme.palette.primary.contrastText,
                    }}/>
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
            sx={{
                color: theme => theme.palette.primary.contrastText,
                ...sx,
            }}
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

function sortUsers(users: (User | DeactivatedUser)[], column: Column, direction: SortDirection): (User | DeactivatedUser)[] { 
    const sortedUsers = [...users]
    switch(column) { 
        case Column.Name: 
            return sortedUsers.sort((a, b) => Compare.alphanumerical(getFullName(a), getFullName(b), direction))
        case Column.Rank: 
            return sortedUsers.sort((a, b) => compareByUserRank(a.rank, b.rank, direction))
        case Column.CapeName:
            return sortedUsers.sort((a, b) => Compare.alphanumerical(a.capeName, b.capeName, direction))
        case Column.Status: 
            return sortedUsers.sort((a, b) => compareByUserStatus(a.status, b.status, direction))
        case Column.Email:
            return sortedUsers.sort((a, b) => Compare.alphanumerical(a.email, b.email, direction))
        case Column.PhoneNumber:
            return sortedUsers.sort((a, b) => Compare.number(a.phoneNumber ?? Number.MAX_SAFE_INTEGER, b.phoneNumber ?? Number.MAX_SAFE_INTEGER, direction))
        case Column.BirthDate:
            return sortedUsers.sort((a, b) => comparByDate(a.birthDate, b.birthDate, direction))
        case Column.Role: 
            return sortedUsers.sort((a, b) => compareByUserRole(a.groupName, b.groupName, direction))
        case Column.StartDate:
            return sortedUsers.sort((a, b) => comparByDate(a.startDate, b.startDate, direction))
        case Column.EndDate:
            return sortedUsers.sort((a, b) => comparByDate(a.endDate, b.endDate, direction))
        case Column.DeactivatedAt:
            return sortedUsers.sort((a, b) => comparByDate("deactivatedAt" in a ? a.deactivatedAt : null, "deactivatedAt" in b ? b.deactivatedAt : null, direction))
        default: {
            if(import.meta.env.DEV)
                throw new Error("Not implemented")
            else 
                return sortedUsers
        }
    }
}

function compareByUserStatus(a: UserStatus, b: UserStatus, sortDirection: "asc" | "desc"): number { 
    return Compare.number(userStatusToNumber(a), userStatusToNumber(b), sortDirection)
}

function compareByUserRank(a: UserRank, b: UserRank, sortDirection: "asc" | "desc"): number { 
    return Compare.number(userRankToNumber(a), userRankToNumber(b), sortDirection)
}

function compareByUserRole(a: UserGroup, b: UserGroup, sortDirection: "asc" | "desc"): number { 
    return Compare.number(userRoleToNumber(a), userRoleToNumber(b), sortDirection)
}

function comparByDate(a: string | null | undefined, b: string | null | undefined, sortDirection: "asc" | "desc"): number { 
    return Compare.timestamp( a ? dayjs(a) : undefined, b ? dayjs(b) : undefined, sortDirection)
}

function userStatusToNumber(status: UserStatus): number { 
    switch(status) { 
        case UserStatus.Active: return 5
        case UserStatus.Veteran: return 4
        case UserStatus.Retired: return 3
        case UserStatus.Inactive: return 2
        case UserStatus.Deactivated: return 1
        default: return 0
    }
}

function userRankToNumber(rank: UserRank): number { 
    switch(rank) { 
        case UserRank.ShortCircuit: return 1
        case UserRank.Ohm: return 2
        case UserRank.KiloOhm: return 3
        case UserRank.MegaOhm: return 4
        case UserRank.GigaOhm: return 5
        case UserRank.HighImpedance: return 6
        default: return 0
    }
}

function userRoleToNumber(role: UserGroup): number { 
    switch(role) { 
        case UserGroup.Contributor: return 1
        case UserGroup.Editor: return 2
        case UserGroup.Administrator: return 3
        case UserGroup.SuperAdministrator: return 4
        default: return 0
    }
}

function formatDate(dateStr: string | null) {
    return dateStr ? dayjs.utc(dateStr).tz().format("MMM YYYY") : "-"
}
