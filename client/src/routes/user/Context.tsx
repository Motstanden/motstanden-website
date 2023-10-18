import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"
import { UserPageHeader } from "./UserPage"

export function UserContext() {
    const { isLoading, isError, data, error } = useQuery<User[]>(["FetchAllUsers"], () => fetchAsync<User[]>("/api/member-list"))

    if (isLoading) {
        return <PageContainer><div /></PageContainer>
    }

    if (isError) {
        return <PageContainer><span>{`${error}`}</span></PageContainer>
    }

    return (
        <PageContainer>
            <Outlet context={data} />
        </PageContainer>
    )
}

export function UserProfileContext() {
    const users = useOutletContext<User[]>()

    const params = useParams();
    const userId = strToNumber(params.userId)
    if (!userId) {
        return <Navigate to="/medlem/liste" />
    }

    const user = users.find(item => item.id === userId)

    if (!user) {
        return <Navigate to="/medlem/liste" />
    }

    return (
        <>
            <UserPageHeader user={user}/>
            <Outlet context={user} />
        </>
    )
}