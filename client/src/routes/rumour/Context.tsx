import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"
import { matchUrl } from "src/utils/matchUrl"
import { PageSkeleton } from "./RumourPage"


const rumourQueryKey = ["FetchAllRumours"]

export const useContextInvalidator = () => useQueryInvalidator(rumourQueryKey)

export function RumourContext() {

    const { isLoading, isError, data, error } = useQuery<QuoteData[]>(rumourQueryKey, () => fetchAsync<QuoteData[]>("/api/rumours"))
    const location = useLocation()

    if (isLoading) {

        if (matchUrl("/rykter", location)) {
            return (
                <PageContainer>
                    <PageSkeleton />
                </PageContainer>
            )
        }

        return <PageContainer />
    }

    if (isError) {
        return <PageContainer>{`${error}`}</PageContainer>
    }

    return (
        <PageContainer>
            <Outlet context={data} />
        </PageContainer>
    )
}

function PageContainer({ children }: { children?: React.ReactNode }) {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/rykter", label: "Rykter" },
                { to: "/rykter/ny", label: "Ny" },
            ]}
        >
            {children}
        </TabbedPageContainer>
    )
}