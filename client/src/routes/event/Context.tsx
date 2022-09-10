import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation, useOutletContext, useParams } from "react-router-dom"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

import { EventData } from "common/interfaces"
import { matchUrl } from "src/utils/matchUrl"
import { strToNumber } from "common/utils"

export function EventContext(){
    
    const {isLoading, isError, data, error} = useQuery<EventData[]>(["FetchAllEvents"], () => fetchAsync<EventData[]>("/api/events/all") )
    
    if (isLoading) {
        return <div style={{minHeight: "100px"}}/>
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }

    return (
        <TabbedPageContainer 
            tabItems={[
                {to: "/arrangement/kommende",    label: "Kommende"},
                {to: "/arrangement/tidligere",   label: "Tidligere"},
                {to: "/arrangement/ny",          label: "ny"}
            ]}
            matchChildPath={true}
        >
            <Outlet context={data} />
        </TabbedPageContainer>
    )
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

export function buildEventItemUrl(event: EventData) {
    return `/arrangement/${event.isUpcoming ? "kommende" : "tidligere"}/${event.eventId}`
}
