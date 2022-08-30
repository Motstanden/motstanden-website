import React from "react"
import { Button } from "@mui/material"
import {Link as RouterLink, Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Event as EventData } from "common/interfaces"
import { strToNumber } from "common/utils"
import { useTitle } from "src/hooks/useTitle"

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
                    <RouterLink to={`/arrangement/${e.isUpcoming ? "kommende" : "tidligere"}/${e.eventId}`} > {e.title}</RouterLink> 
                </li>
            ))}
        </ul>
    )
}

export function EventItemContext(){
    const allEvents = useOutletContext<EventData[]>()

    const params = useParams();
    const eventId = strToNumber(params.eventId)
    if(!eventId){
        return <Navigate to="/arrangement"/>
    }
    
    const event = allEvents.find( item => item.eventId === eventId)

    if(!event) {
        return <Navigate to="/arrangement"/>
    }

    return (
        <Outlet context={event}/>
    )
}   

export function EventItemPage(){
    const event = useOutletContext<EventData>()
    return (
        <h1>{event.title}</h1>
    )   
}

export function EditEventPage(){
    const event = useOutletContext<EventData>()
    return (
        <h1>Rediger: {event.title}</h1>
    )
}