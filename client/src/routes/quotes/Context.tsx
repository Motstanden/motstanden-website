import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import { Outlet, useMatch } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { ListPageSkeleton } from "./ListPage.skeleton"

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

    const isQuotesPage = useMatch("/sitater")

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
