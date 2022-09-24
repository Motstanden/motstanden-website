import React from "react"
import { Paper, Stack } from "@mui/material"
import {Link as RouterLink, useOutletContext, useParams } from "react-router-dom"
import Link from "@mui/material/Link" 
import { EventData } from "common/interfaces"
import { useTitle } from "src/hooks/useTitle"
import { postJson } from "src/utils/postJson"
import { buildEventItemUrl } from "./Context"
import { KeyInfo } from "./components/KeyInfo"
import { ItemMenu } from "./components/ItemMenu"

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

export async function deleteEvent(event: EventData) {
    const response = await postJson(
        "/api/events/delete", 
        {eventId: event.eventId}, 
        {
            confirmText: `Vil du permanent slette:\n«${event.title}»`,
            alertOnFailure: true
        }
    )
}