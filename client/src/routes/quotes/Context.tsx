import React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { TabbedPageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"
import { Quote as QuoteData } from "common/interfaces"

const quotesQueryKey = ["FetchAllQuotes"]

export function QuotesContext(){
    
    const {isLoading, isError, data, error} = useQuery<QuoteData[]>(quotesQueryKey, () => fetchAsync<QuoteData[]>("/api/quotes") )
    
    if (isLoading) {
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

export function useContextInvalidator(){
    const queryClient = useQueryClient()

    const invalidateQuery = () => {
        queryClient.invalidateQueries(quotesQueryKey)
    }
    
    return invalidateQuery
}