import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import { Outlet, useLocation } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { matchUrl } from "src/utils/matchUrl"
import { ListPageSkeleton } from "./ListPageSkeleton"

const quotesQueryKey = ["FetchAllQuotes"]

export const useContextInvalidator = () => useQueryInvalidator(quotesQueryKey)

export {
    QuotesContainer as QuotesContext
}

function QuotesContainer() {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/sitater", label: "sitater" },
                { to: "/sitater/ny", label: "ny" },
            ]}
        >
            <QuotesLoader/>
        </TabbedPageContainer>
    )
}

function QuotesLoader() {
    const { isPending, isError, data, error } = useQuery<QuoteData[]>({
        queryKey: quotesQueryKey,
        queryFn: fetchFn<QuoteData[]>("/api/quotes"),
    })

    const location = useLocation()
    const isQuotesPage = matchUrl("/sitater", location)

    if (isPending && isQuotesPage) {
        return <ListPageSkeleton/>
    }

    if (isError) {
        return `${error}`
    }

    return (
        <Outlet context={data} />
    )
}
