import { useQuery } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { Outlet, useOutletContext } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "src/utils/fetchAsync";
import { PollPageSkeleton } from './skeleton/PollPage';


export const pollListQueryKey = ["FetchPollList"]

export function PollContext() {

    const {isPending, isError, data, error} = useQuery<Poll[]>({
        queryKey: pollListQueryKey,
        queryFn: fetchFn<Poll[]>("/api/polls/all")
    })

    if(isPending)
        return <PageContainer><PollPageSkeleton/></PageContainer>

    if(isError)
        return <PageContainer>{`${error}`}</PageContainer>

    const [currentPoll, ...rest] = data
    const contextValue: PollContextType = {
        currentPoll: currentPoll,
        remainingPolls: rest
    }
    
    return (
        <PageContainer>
            <Outlet context={contextValue}/>
        </PageContainer>
    )
}

export function usePolls() {
    return useOutletContext<PollContextType>()
}

interface PollContextType {
    currentPoll?: Poll,
    remainingPolls: Poll[]
}

function PageContainer({ children }: { children?: React.ReactNode }) {
    return (
        <TabbedPageContainer
            tabItems={[
                { to: "/avstemninger", label: "avstemninger" },
                { to: "/avstemninger/ny", label: "ny" },
            ]}
        >
            {children}
        </TabbedPageContainer>
    )
}