import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import { Outlet, useMatch } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { QuotesListPageSkeleton } from "./skeleton/ListPage"
import { useAppBarHeader } from "src/context/AppBarHeader"

const quotesQueryKey = ["FetchAllQuotes"]

export const useContextInvalidator = () => useQueryInvalidator(quotesQueryKey)

export {
    QuotesContainer as QuotesContext
}

function QuotesContainer() {
    useAppBarHeader("Sitater")
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/sitater", label: "alle" },
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
        return <QuotesListPageSkeleton/>
    }

    if (isError) {
        return `${error}`
    }

    return (
        <Outlet context={data} />
    )
}
