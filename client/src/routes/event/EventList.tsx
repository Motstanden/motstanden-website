import React from "react"
import { IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Stack, Theme, Tooltip, useMediaQuery } from "@mui/material"
import {Link as RouterLink, Navigate, Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom"
import Link from "@mui/material/Link" 
import { EventData, KeyValuePair } from "common/interfaces"
import { hasGroupAccess, strToNumber } from "common/utils"
import { useTitle } from "src/hooks/useTitle"
import { matchUrl } from "src/utils/matchUrl"
import dayjs from "dayjs"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconPopupMenu } from "src/components/IconPopupMenu"
import { useAuth } from "src/context/Authentication"
import { UserGroup } from "common/enums"
import postJson from "src/utils/postJson"

export function EventListPage( { mode }: {mode?: "upcoming" | "previous" | "all"} ){
    useTitle("Arrangement")

    let events = useOutletContext<EventData[]>()
    if(mode === "upcoming")
        events = events.filter( e => e.isUpcoming)
    
    if( mode === "previous")
        events = events.filter( e => !e.isUpcoming)

    return (
        <>
            <h1>Arrangement</h1>
            <div style={{maxWidth: "650px"}}>
                {events.map((e, index) => <EventItem key={`${index} ${e.title}}`} event={e}/>)}
            </div>
        </>
    )
}

function EventItem( {event}: {event: EventData} ) {
    return (
        <Paper sx={{mb: 4, p: 2, pt: 1.5}} elevation={3}>
            <Stack direction="row"  justifyContent="space-between" alignItems="center">
                <h3 style={{margin: 0}}>
                    <Link 
                        color="secondary" 
                        component={RouterLink}
                        to={buildEventItemUrl(event)}
                        underline="hover"
                        >
                            {event.title}
                    </Link>

                </h3>
                <ItemMenu event={event}/>
            </Stack>
            <KeyValueList 
                items={[
                    { 
                        key: "Tid:", 
                        value: formatTimeInfo(event.startDateTime, event.endDateTime)
                    },
                    ...event.keyInfo
                ]}
            />
        </Paper>
    )
}

export function KeyValueList( {items, style}: {items: KeyValuePair<string, string>[], style?: React.CSSProperties}) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    if(items.length === 0){
        return <></>
    }   

    // Small screen
    if(isSmallScreen){
        return(
            <div style={{
                marginTop: "10px",
                marginBottom: "10px",
                ...style
                }}
            >
                {items.map( (item, index) => ( 
                    <div 
                        key={`${index} ${item.key} ${item.value}`} 
                        style={{
                            marginBottom: "10px"
                        }} 
                    >
                        <strong>{item.key + " "}</strong>
                        <span>{item.value}</span>  
                    </div>
                ))}
            </div>
        )
    }

    // Large screen
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "min-content auto", //
            columnGap: "10px",
            rowGap: "5px",
            margin: "10px",
            ...style
        }}
    >
        {items.map( (item, index) => (
            // We must use react fragment in order to access the key attribute 
            <React.Fragment key={`${index} ${item.key} ${item.value}`}> 
                <div>
                    <strong>{item.key}</strong>
                </div>
                <div>
                    {item.value}
                </div>
            </React.Fragment>
        ))}
    </div>
    )
}

export function formatTimeInfo(startStr: string, endStr: string | null): string {
    const start = dayjs(startStr)

    const dayFormat = start.year() === dayjs().year() 
                    ? "ddd D. MMM" 
                    : "ddd D. MMM YYYY,"
    const hourFormat = "HH:mm"

    if(!endStr) {
        return `${start.format(dayFormat)} ${start.format(hourFormat)}`
    }

    const end = dayjs(endStr)
    const isSameDate = start.format("YYYY-MM-DD") === end.format("YYYY-MM-DD")
    const isSmallDiff = start.diff(end, "hours") < 24 && end.hour() < 6

    if(isSameDate || isSmallDiff) {
        return `${start.format(dayFormat)} kl: ${start.format(hourFormat)} – ${end.format(hourFormat)}`
    }
    return `${start.format(dayFormat)} kl: ${start.format(hourFormat)} – ${end.format(dayFormat)} kl: ${end.format(hourFormat)}`
}

function buildEventItemUrl(event: EventData) {
    return `/arrangement/${event.isUpcoming ? "kommende" : "tidligere"}/${event.eventId}`
}

export function ItemMenu({event, iconOrientation}: {event: EventData, iconOrientation?: "horizontal" | "vertical"}){
    const user = useAuth().user!
    const navigate = useNavigate()

    const onEditClick = () => navigate(`${buildEventItemUrl(event)}/rediger`)

    if(!hasGroupAccess(user, UserGroup.Administrator) && user.userId !== event.createdByUserId ) {
        return ( 
            <Tooltip title="Rediger">
                <IconButton onClick={onEditClick}>
                    <EditIcon/>
                </IconButton>
            </Tooltip>
        )
    }

    return(
        <IconPopupMenu icon={iconOrientation === "vertical" ? <MoreVertIcon/> : <MoreHorizIcon/>} >
            <MenuList style={{minWidth: "180px"}} disablePadding> 
                <MenuItem style={{minHeight: "50px"}} divider={true} onClick={onEditClick}>
                    <ListItemIcon>
                        <EditIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText>
                        Rediger
                    </ListItemText>
                </MenuItem>
                <MenuItem style={{minHeight: "50px"}} sx={{backgroundColor: "error"}} onClick={() => deleteEvent(event)}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{color: "error"}}>
                        Slett
                    </ListItemText>
                </MenuItem>
            </MenuList>
        </IconPopupMenu>
    )
}

async function deleteEvent(event: EventData) {
    if(window.confirm(`Vil du permanent slette:\n«${event.title}»`)) {
        const response = await postJson("/api/events/delete", {eventId: event.eventId})
        if(!response.ok){
            console.log(response)
            window.alert("Noe gikk galt\nSi ifra til webansvarlig")
        }
    }
}

export function EventItemContext(){
    const allEvents = useOutletContext<EventData[]>()
    const location = useLocation()

    // Check if the url parameter is a number
    const params = useParams();
    const eventId = strToNumber(params.eventId)
    if(!eventId){
        return <Navigate to="/arrangement"/>
    }
    
    // Check if the provided parameter matches and even id
    const event = allEvents.find( item => item.eventId === eventId)
    if(!event) {
        return <Navigate to="/arrangement"/>
    }

    // Redirect to correct url if the pattern does not match '/arrangement/[kommende | tidligere]/:eventId'
    const expectedUrlBase = buildEventItemUrl(event);
    const isBaseUrl = matchUrl(expectedUrlBase, location)
    const isEditUrl = matchUrl(`${expectedUrlBase}/rediger`, location) || matchUrl(`${expectedUrlBase}/rediger/`, location)
    if(!isBaseUrl && !isEditUrl){
        return <Navigate to={expectedUrlBase}/>
    }

    return (
        <Outlet context={event}/>
    )
}   