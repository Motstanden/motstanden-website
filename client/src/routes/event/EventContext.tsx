import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

import { Event as EventData } from "common/interfaces"

export function EventContext(){
    
    // const {isLoading, isError, data, error} = useQuery<EventData[]>(["FetchAllEvents"], () => fetchAsync<EventData[]>("/api/events/all") )
    
    // if (isLoading) {
    //     return <div style={{minHeight: "100px"}}/>
    // }
    
    // if (isError) {
    //     return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    // }

    return (
        <TabbedPageContainer 
            tabItems={[
                {to: "/arrangement/kommende",    label: "Kommende"},
                {to: "/arrangement/tidligere",   label: "Tidligere"},
                {to: "/arrangement/ny",          label: "ny"}
            ]}
            matchChildPath={true}
        >
            <Outlet 
                context={[]}
                // context={data} 
            />
        </TabbedPageContainer>
    )
}