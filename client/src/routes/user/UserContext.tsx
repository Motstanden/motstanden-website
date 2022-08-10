import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { Outlet } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

export function UserContext() {
    const {isLoading, isError, data, error} = useQuery<User[]>(["FetchAllUsers"], () => fetchAsync<User[]>("/api/member-list") )
    
    if (isLoading) {
        return <PageContainer><div/></PageContainer>
    }
    
    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }   
    
    return (
        <PageContainer>
            <Outlet context={data}/>
        </PageContainer>
    )
}