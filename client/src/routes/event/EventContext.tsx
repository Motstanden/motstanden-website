import { useQuery } from "@tanstack/react-query"
import React from "react"
import { Outlet } from "react-router-dom"
import { defaultPagePadding, PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

import { Event as EventData } from "common/interfaces"
import { NavLink } from "react-router-dom";
import { PageTab } from "src/components/PageTab"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Theme } from "@mui/material"

export function EventContext(){
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    const {isLoading, isError, data, error} = useQuery<EventData[]>(["FetchAllEvents"], () => fetchAsync<EventData[]>("/api/events/all") )
    
    if (isLoading) {
        return <div style={{minHeight: "100px"}}/>
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }


    return (
        <PageContainer disableGutters={isSmall}>
            <PageTab items={[
                {to: "/arrangement/kommende",    label: "Kommende"},
                {to: "/arrangement/tidligere",   label: "Tidligere"},
                {to: "/arrangement/ny",          label: "ny"}
            ]}/>
            <div style={{padding: isSmall ? defaultPagePadding : 0}}>
                <Outlet context={data} />
            </div>
        </PageContainer>
    )
}