import { useQuery } from "@tanstack/react-query"
import React from "react"
import { Outlet } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

import { Event as EventData } from "common/interfaces"
import { NavLink } from "react-router-dom";

export function EventContext(){

    const {isLoading, isError, data, error} = useQuery<EventData[]>(["FetchAllEvents"], () => fetchAsync<EventData[]>("/api/events/all") )
    
    if (isLoading) {
        return <div style={{minHeight: "100px"}}/>
    }
    
    if (isError) {
        return <div style={{minHeight: "100px"}}>{`${error}`}</div>
    }

    return (
        <PageContainer>
            <EventNavigation/>
            <Outlet context={data} />
        </PageContainer>
    )
}

function EventNavigation() {

    return (
        <nav> 
            <PageNavLink
                to="kommende"  
                text="Kommende" 
            />
            <PageNavLink 
                to="tidligere" 
                text="Tidligere" 
                style={{paddingLeft: "20px"}} />
            <PageNavLink 
                to="ny"        
                text="Ny" 
                style={{paddingLeft: "20px"}}/>
        </nav>
    )
}

function PageNavLink( {to, text, style}: {to: string, text: string, style?: React.CSSProperties} ){

    const baseStyle: React.CSSProperties = {
        ...style,
        textDecoration: "none",
        color: "inherit"
    }

    const activeStyle: React.CSSProperties = {
        ...baseStyle,
        fontWeight: "bolder",
        color: "green"
    }

    return (
        <NavLink 
            to={to} 
            style={({ isActive }) => isActive ? activeStyle : baseStyle} 
        >
            {text}
        </NavLink>
    )
}