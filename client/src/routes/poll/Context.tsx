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
                { to: "/avstemninger", label: "avstemninger" },
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

    const [currentPoll, ...rest] = data
    const contextValue: PollContextType = {
        currentPoll: currentPoll,
        remainingPolls: rest
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
    remainingPolls: Poll[]
}