import { useQuery } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { Outlet } from "react-router-dom";
import { TabbedPageContainer } from "src/layout/PageContainer";
import { fetchAsync } from "src/utils/fetchAsync";
import { PollPageSkeleton } from "./Poll";


export const pollListQueryKey = ["FetchPollList"]

export function PollContext() {

    const {isLoading, isError, data, error} = useQuery<Poll[]>(pollListQueryKey, () => fetchAsync<Poll[]>("/api/polls/all"))

    if(isLoading)
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