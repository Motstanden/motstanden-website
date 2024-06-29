import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { useAppBarHeader } from "src/context/AppBarHeader"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { UserPageSkeleton } from "./skeleton/UserPage"

export const userListQueryKey = ["FetchAllUsers"]

export {
    RootPageContainer as UserListContext
}

function RootPageContainer() {
    return (
        <PageContainer>
            <UserListContext/>
        </PageContainer>
    )
}

function UserListContext() {
    const { isPending, isError, data, error } = useQuery<User[]>({
        queryKey: userListQueryKey,
        queryFn: fetchFn<User[]>("/api/users"),
    })

    if (isError) {
        return `${error}`
    }

    const context: UserListContextProps = isPending 
        ? { isPending: true, users: undefined }
        : { isPending: false, users: data }

    return (
        <Outlet context={context} />
    )
}

type UserListContextProps = {
    isPending: true,
    users: undefined
} | {
    isPending: false,
    users: User[]
}

export function useUserListContext(): UserListContextProps {
    return useOutletContext<UserListContextProps>()
}


export function UserProfileContext() {
    const {users, isPending} = useUserListContext()
    useAppBarHeader("Medlem")

    if(isPending)
        return <UserPageSkeleton/>

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
        <Outlet context={context} />
    )
}

type UserProfileContextProps = { users: User[], viewedUser: User }

export function useUserProfileContext(): UserProfileContextProps {
    return useOutletContext<UserProfileContextProps>()
}