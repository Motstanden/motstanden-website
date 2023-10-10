import { useQuery } from "@tanstack/react-query";
import { Poll } from "common/interfaces";
import { Outlet } from "react-router-dom";
import { useQueryInvalidator } from "src/hooks/useQueryInvalidator";
import { TabbedPageContainer } from "src/layout/PageContainer";
import { fetchAsync } from "src/utils/fetchAsync";


const pollListQueryKey = ["FetchPollList"]

export const useContextInvalidator = () => useQueryInvalidator(pollListQueryKey)

export function PollContext() {

    const {isLoading, isError, data, error} = useQuery<Poll[]>(pollListQueryKey, () => fetchAsync<Poll[]>("/api/polls/all"))

    if(isLoading)
        return <PageContainer></PageContainer>

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
                { to: "/avstemminger", label: "avstemminger" },
                { to: "/avstemminger/ny", label: "ny" },
            ]}
        >
            {children}
        </TabbedPageContainer>
    )
}