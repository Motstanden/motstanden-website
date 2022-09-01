import React from "react"
import { Button } from "@mui/material"
import {Link as RouterLink, Navigate, Outlet, useLocation, useOutletContext, useParams } from "react-router-dom"
import { EventData } from "common/interfaces"
import { strToNumber } from "common/utils"
import { useTitle } from "src/hooks/useTitle"
import DOMPurify from "dompurify"
import { matchUrl } from "src/utils/matchUrl"

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
            <EventList events={events}/>
        </>
    )
}

export function EventList( { events }: {events: EventData[]}){
    return (
        <ul>
            {events.map( e => ( 
                <li key={e.eventId}>
                    <RouterLink to={buildEventItemUrl(e)} > {e.title}</RouterLink> 
                </li>
            ))}
        </ul>
    )
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