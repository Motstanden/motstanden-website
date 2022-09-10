import React from "react"
import { IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Stack, Tooltip } from "@mui/material"
import {Link as RouterLink, useNavigate, useOutletContext, useParams } from "react-router-dom"
import Link from "@mui/material/Link" 
import { EventData } from "common/interfaces"
import { hasGroupAccess, strToNumber } from "common/utils"
import { useTitle } from "src/hooks/useTitle"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconPopupMenu } from "src/components/IconPopupMenu"
import { useAuth } from "src/context/Authentication"
import { UserGroup } from "common/enums"
import postJson from "src/utils/postJson"
import { buildEventItemUrl } from "./Context"
import { KeyInfo } from "./KeyInfo"

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
            <KeyInfo keyInfo={event.keyInfo} startTime={event.startDateTime} endTime={event.endDateTime} />
        </Paper>
    )
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