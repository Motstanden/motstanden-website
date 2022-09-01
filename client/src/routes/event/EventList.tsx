import React from "react"
import { Paper, Theme, useMediaQuery } from "@mui/material"
import {Link as RouterLink, Navigate, Outlet, useLocation, useOutletContext, useParams } from "react-router-dom"
import Link from "@mui/material/Link" 
import { EventData, KeyValuePair } from "common/interfaces"
import { strToNumber } from "common/utils"
import { useTitle } from "src/hooks/useTitle"
import DOMPurify from "dompurify"
import { matchUrl } from "src/utils/matchUrl"
import dayjs from "dayjs"

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
        <Paper sx={{mb: 4, p: 2}} elevation={3}>
            <h4 style={{margin: 0}}>
                <Link 
                    color="secondary" 
                    component={RouterLink}
                    to={buildEventItemUrl(event)}
                    underline="hover"
                    >
                        {event.title}
                </Link>
            </h4>
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

function KeyValueList( {items}: {items: KeyValuePair<string, string>[]}) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    if(items.length === 0){
        return <></>
    }   

    // Small screen
    if(isSmallScreen){
        return(
            <div style={{marginBlock: "10px"}}>
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

function formatTimeInfo(startStr: string, endStr: string | null): string {
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
    const expectedPattern = buildEventItemUrl(event);
    if(!matchUrl(expectedPattern, location)){
        return <Navigate to={expectedPattern}/>
    }

    return (
        <Outlet context={event}/>
    )
}   

export function EventItemPage(){
    const event = useOutletContext<EventData>()
    return (
        <>
            <h1>{event.title}</h1>
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(event.description)}}/>
        </>
    )   
}

export function EditEventPage(){
    const event = useOutletContext<EventData>()
    return (
        <h1>Rediger: {event.title}</h1>
    )
}