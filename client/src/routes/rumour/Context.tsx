import { useQuery } from "@tanstack/react-query"
import { Quote as QuoteData } from "common/interfaces"
import { Outlet, useMatch } from "react-router-dom"
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { RumourPageSkeleton } from "./skeleton/RumourPage"
import { useAppBarHeader } from "src/context/AppBarHeader"

const rumourQueryKey = ["FetchAllRumours"]

export const useContextInvalidator = () => useQueryInvalidator(rumourQueryKey)

export {
    RumourContainer as RumourContext
}

function RumourContainer() {
    useAppBarHeader("Rykter")
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

    const isRumourPage =useMatch("/rykter")

    if (isPending && isRumourPage) {
        return <RumourPageSkeleton />
    }

    if (isError) {
        return `${error}`
    }

    return (
        <Outlet context={data} />
    )
}