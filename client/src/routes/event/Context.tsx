import { useQuery } from "@tanstack/react-query"
import { Navigate, Outlet, useLocation, useMatch, useOutletContext, useParams } from "react-router-dom"
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer"
import { fetchFn } from "src/utils/fetchAsync"

import { EventData } from "common/interfaces"
import { strToNumber } from "common/utils"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { matchUrl } from "src/utils/matchUrl"
import { EventEditPageSkeleton } from "./skeleton/EditPage"
import { EventItemPageSkeleton } from "./skeleton/ItemPage"
import { EventListPageSkeleton } from "./skeleton/ListPage"

export const eventContextQueryKey = ["FetchEventContext"]

export {
    EventContainer as EventContext
}

function EventContainer() {
    useAppBarHeader("Arrangement")
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/arrangement/kommende", label: "Kommende" },
                { to: "/arrangement/tidligere", label: "Tidligere" },
                { to: "/arrangement/ny", label: "ny" }
            ]}
            matchChildPath={true}
        >
            <EventContextLoader/>
        </TabbedPageContainer>
    )
}

function EventContextLoader() {
    const { isPending, isError, data, error } = useQuery<EventData[]>({
        queryKey: eventContextQueryKey,
        queryFn: fetchFn<EventData[]>("/api/events"),
    })

    const { isListPage, isItemPage, isEditPage } = useEventUrlMatch()

    if (isPending) {

        if(isListPage)
            return <EventListPageSkeleton/>
        
        if(isItemPage)
            return <EventItemPageSkeleton/>

        if(isEditPage)
            return <EventEditPageSkeleton/>

        return <></>
    }

    if (isError) {
        return `${error}`
    }

    return (
        <Outlet context={data} />
    )
}

export function EventItemContext() {
    const allEvents = useOutletContext<EventData[]>()
    const location = useLocation()

    // Check if the url parameter is a number
    const params = useParams();
    const eventId = strToNumber(params.eventId)
    if (!eventId) {
        return <Navigate to="/arrangement" replace />
    }

    // Check if the provided parameter matches an eventId
    const event = allEvents.find(item => item.id === eventId)
    if (!event) {
        return <Navigate to="/arrangement" replace/>
    }

    // Redirect to correct url if the pattern does not match '/arrangement/[kommende | tidligere]/:eventId'
    const expectedUrlBase = buildEventItemUrl(event);
    const isBaseUrl = matchUrl(expectedUrlBase, location)
    const isEditUrl = matchUrl(`${expectedUrlBase}/rediger`, location) || matchUrl(`${expectedUrlBase}/rediger/`, location)
    if (!isBaseUrl && !isEditUrl) {
        return <Navigate to={expectedUrlBase + location.hash} replace />
    }

    return (
        <Outlet context={event} />
    )
}

type EventUrlMatch = {
    isListPage: boolean
    isItemPage: boolean
    isEditPage: boolean
}

function useEventUrlMatch(): EventUrlMatch {

    const isList1 = useMatch("/arrangement")
    const isList2 =  useMatch("/arrangement/tidligere") 
    const isList3 = useMatch("/arrangement/kommende") 
    
    const isItem1 = useMatch("/arrangement/kommende/:id") 
    const isitem2 = useMatch("/arrangement/tidligere/:id")
    
    const isEdit1 = useMatch("/arrangement/kommende/:id/rediger") 
    const isEdit2 = useMatch("/arrangement/tidligere/:id/rediger")

    return {
        isListPage: !!(isList1 || isList2 || isList3),
        isItemPage: !!(isItem1 || isitem2),
        isEditPage: !!(isEdit1 || isEdit2)
    }
}

export function buildEventItemUrl(event: EventData) {
    return `/arrangement/${event.isUpcoming ? "kommende" : "tidligere"}/${event.id}`
}
