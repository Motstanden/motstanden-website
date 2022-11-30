import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Suspense } from "react"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer"
import { fetchAsync } from "src/utils/fetchAsync"

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
            <Suspense>
                <Outlet context={data} />
            </Suspense>
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

    const user = users.find(item => item.userId === userId)

    if (!user) {
        return <Navigate to="/medlem/liste" />
    }

    return (
        <Suspense>
            <Outlet context={user} />
        </Suspense>
    )
}