import React from "react"
import { Outlet } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"

export function EventContext(){

    // TODO: Query server for event data here
    // const data = ...

    return (
        <PageContainer>
            <Outlet 
                // context={data}
            />
        </PageContainer>
    )
}