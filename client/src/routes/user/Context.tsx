import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { UserPageHeader } from "./UserPage"

export const userListQueryKey = ["FetchAllUsers"]

export function UserContext() {
    const { isPending, isError, data, error } = useQuery<User[]>({
        queryKey: userListQueryKey,
        queryFn: fetchFn<User[]>("/api/member-list"),
    })

    if (isPending) {
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
        return <Navigate to="/medlem/liste" replace />
    }

    const user = users.find(item => item.id === userId)

    if (!user) {
        return <Navigate to="/medlem/liste" replace />
    }

    return (
        <>
            <UserPageHeader user={user}/>
            <Outlet context={user} />
        </>
    )
}