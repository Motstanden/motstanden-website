import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import React from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { matchUrl } from "src/utils/matchUrl"
import { ListPageSkeleton } from "./ListPageSkeleton"

const quotesQueryKey = ["FetchAllQuotes"]

export const useContextInvalidator = () => useQueryInvalidator(quotesQueryKey)

export function QuotesContext() {

    const location = useLocation()
    const { isPending, isError, data, error } = useQuery<QuoteData[]>({
        queryKey: quotesQueryKey,
        queryFn: fetchFn<QuoteData[]>("/api/quotes"),
    })

    if (isPending) {

        if (matchUrl("/sitater", location)) {
            return (
                <PageContainer>
                    <ListPageSkeleton />
                </PageContainer>
            )
        }
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