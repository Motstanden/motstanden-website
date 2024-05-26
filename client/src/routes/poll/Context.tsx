import { useQuery } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { Outlet, useMatch, useOutletContext } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "src/utils/fetchAsync";
import { AllPollsPageSkeleton } from "./skeleton/AllPollsPage";
import { CurrentPollPageSkeleton } from './skeleton/CurrentPollPage';
import { PollItemPageSkeleton } from "./skeleton/PollItemPage";
import { useAppBarHeader } from "src/context/AppBarHeader";

export const pollBaseQueryKey = ["poll"]

export const pollListQueryKey = [...pollBaseQueryKey, "all"]

export {
    PollsContainer as PollContext
};

function PollsContainer() {
    useAppBarHeader("Avstemninger")
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/avstemninger/paagaaende", label: "Pågående" },
                { to: "/avstemninger/alle", label: "Alle", isFallbackTab: true},
                { to: "/avstemninger/ny", label: "ny" },
            ]}
        >
            <PollLoader/>
        </TabbedPageContainer>
    )
}

function PollLoader() {

    const {isPending, isError, data, error} = useQuery<Poll[]>({
        queryKey: pollListQueryKey,
        queryFn: fetchFn<Poll[]>("/api/polls/all")
    })

    const {isCurrentPollPage, isAllPollsPage, isPollItemPage, isNewPollsPage} = usePollUrlMatch()
    if(isPending) {
        if(isCurrentPollPage)
            return <CurrentPollPageSkeleton/>

        if(isAllPollsPage)
            return <AllPollsPageSkeleton/>

        if(isPollItemPage)
            return <PollItemPageSkeleton/>        

        if(!isNewPollsPage)     // New page does not depend on the data
            return <></>
    }

    if(isError)
        return `${error}`
    
    let contextValue: PollContextType | undefined = undefined
    if(data) {
        contextValue = {
            currentPoll: data.length > 0 ? data[0] : undefined,
            polls: data
        }
    }

    return (
        <Outlet context={contextValue}/>
    )
}

export function usePolls() {
    return useOutletContext<PollContextType>()
}

interface PollContextType {
    currentPoll?: Poll,
    polls: Poll[]
}

type PollUrlMatch = { 
    isCurrentPollPage: boolean,
    isAllPollsPage: boolean,
    isNewPollsPage: boolean,
    isPollItemPage: boolean
}

function usePollUrlMatch(): PollUrlMatch {
    const isCurrent = useMatch("/avstemninger/paagaaende")
    const isAll = useMatch("/avstemninger/alle")
    const isNew = useMatch("/avstemninger/ny")
    const isItem = useMatch("/avstemninger/:pollId")
    return {
        isCurrentPollPage: !!isCurrent,
        isAllPollsPage: !!isAll,
        isNewPollsPage: !!isNew,
        isPollItemPage: !!isItem
    }
}