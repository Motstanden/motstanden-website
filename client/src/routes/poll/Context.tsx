import { useQuery } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer/TabbedPageContainer";
import { fetchFn } from "src/utils/fetchAsync";
import { PollPageSkeleton } from "./Poll";


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

    return (
        <PageContainer>
            <Outlet context={data}/>
        </PageContainer>
    )
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