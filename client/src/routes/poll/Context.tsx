import { useQuery } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { Outlet, useOutletContext } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "src/utils/fetchAsync";
import { PollPageSkeleton } from './skeleton/PollPage';

export const pollListQueryKey = ["FetchPollList"]

export {
    PollsContainer as PollContext
};

function PollsContainer() {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/avstemninger/paagaaende", label: "Pågående" },
                { to: "/avstemninger/alle", label: "Alle" },
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

    if(isPending)
        return <PollPageSkeleton/>

    if(isError)
        return `${error}`

    const contextValue: PollContextType = {
        currentPoll: data.length > 0 ? data[0] : undefined,
        polls: data
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