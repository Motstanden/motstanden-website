import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { matchUrl } from "src/utils/matchUrl"
import { PageSkeleton } from "./RumourPage"

const rumourQueryKey = ["FetchAllRumours"]

export const useContextInvalidator = () => useQueryInvalidator(rumourQueryKey)

export {
    RumourContainer as RumourContext
}

function RumourContainer() {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/rykter", label: "Rykter" },
                { to: "/rykter/ny", label: "Ny" },
            ]}
        >
            <RumourLoader/>
        </TabbedPageContainer>
    )
}

function RumourLoader() {
    const { isPending, isError, data, error } = useQuery<QuoteData[]>({
        queryKey: rumourQueryKey,
        queryFn: fetchFn<QuoteData[]>("/api/rumours"),
    })

    const location = useLocation()
    const isRumourPage = matchUrl("/rykter", location)

    if (isPending && isRumourPage) {
        return <PageSkeleton />
    }

    if (isError) {
        return `${error}`
    }

    return (
        <Outlet context={data} />
    )
}