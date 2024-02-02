import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { UserPageHeader } from "./UserPage"

export const userListQueryKey = ["FetchAllUsers"]

export {
    UserContainer as UserContext
}

function UserContainer() {
    return (
        <PageContainer>
            <UserContextLoader/>
        </PageContainer>
    )
}

function UserContextLoader() {
    const { isPending, isError, data, error } = useQuery<User[]>({
        queryKey: userListQueryKey,
        queryFn: fetchFn<User[]>("/api/member-list"),
    })

    if (isPending) {
        return <></>
    }

    if (isError) {
        return `${error}`
    }

    return (
        <Outlet context={data} />
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

    const context: UserProfileContextProps = { 
        users: users, 
        viewedUser: user 
    }

    return (
        <>
            <UserPageHeader user={user}/>
            <Outlet context={context} />
        </>
    )
}

export function useUserContext(): User[] {
    return useOutletContext<User[]>()
}

type UserProfileContextProps = { users: User[], viewedUser: User }

export function useUserProfileContext(): UserProfileContextProps {
    return useOutletContext<UserProfileContextProps>()
}