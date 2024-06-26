import { useQuery } from "@tanstack/react-query"
import { User } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { fetchFn } from "src/utils/fetchAsync"
import { UserPageHeader } from "./UserPage"
import { UserPageSkeleton } from "./skeleton/UserPage"
import { useAppBarHeader } from "src/context/AppBarHeader"

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
        queryFn: fetchFn<User[]>("/api/users"),
    })

    if (isError) {
        return `${error}`
    }

    const context: UsersContextProps = isPending 
        ? { isPending: true, users: undefined }
        : { isPending: false, users: data }

    return (
        <Outlet context={context} />
    )
}

export function UserProfileContext() {
    const {users, isPending} = useUsersContext()
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
        <div style={{maxWidth: "1300px"}}>
            <UserPageHeader user={user}/>
            <Outlet context={context} />
        </div>
    )
}

type UsersContextProps = {
    isPending: true,
    users: undefined
} | {
    isPending: false,
    users: User[]
}

export function useUsersContext(): UsersContextProps {
    return useOutletContext<UsersContextProps>()
}

type UserProfileContextProps = { users: User[], viewedUser: User }

export function useUserProfileContext(): UserProfileContextProps {
    return useOutletContext<UserProfileContextProps>()
}