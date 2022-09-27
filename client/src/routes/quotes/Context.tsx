import React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Outlet, useLocation } from "react-router-dom"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"
import { Quote as QuoteData } from "common/interfaces"
import { ItemSkeleton } from "./QuotesPage"
import { matchUrl } from "src/utils/matchUrl"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"

const quotesQueryKey = ["FetchAllQuotes"]

export const useContextInvalidator = () => useQueryInvalidator(quotesQueryKey)

export function QuotesContext(){
    
    const {isLoading, isError, data, error} = useQuery<QuoteData[]>(quotesQueryKey, () => fetchAsync<QuoteData[]>("/api/quotes") )
    const location = useLocation()

    if (isLoading) {

        if(matchUrl("/sitater", location)){
            return (
                <PageContainer>
                    <h1>Sitater</h1>
                    {Array(20).fill(1).map( (_, i) => <ItemSkeleton key={i}/>)}
                </PageContainer>
            )
        }

        return <PageContainer/>
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

function PageContainer({ children }: {children?: React.ReactNode}) {
    return (
        <TabbedPageContainer
            tabItems={[
                {to: "/sitater",    label: "sitater"},
                {to: "/sitater/ny", label: "ny"},
            ]}
        >
            {children}
        </TabbedPageContainer>
    )
}