import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"
import { matchUrl } from "src/utils/matchUrl"
import { PageSkeleton } from "./QuotesPage"

const quotesQueryKey = ["FetchAllQuotes"]

export const useContextInvalidator = () => useQueryInvalidator(quotesQueryKey)

export function QuotesContext() {

    const { isLoading, isError, data, error } = useQuery<QuoteData[]>(quotesQueryKey, () => fetchAsync<QuoteData[]>("/api/quotes"))
    const location = useLocation()

    if (isLoading) {

        if (matchUrl("/sitater", location)) {
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
                { to: "/sitater", label: "sitater" },
                { to: "/sitater/ny", label: "ny" },
            ]}
        >
            {children}
        </TabbedPageContainer>
    )
}