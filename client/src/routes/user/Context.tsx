import { useQuery } from "@tanstack/react-query"
import { DeactivatedUser, User } from "common/interfaces"
import { Outlet, useOutletContext } from "react-router-dom"
import { usePotentialUser } from "src/context/Authentication"
import { PageContainer } from "src/layout/PageContainer/PageContainer"
import { fetchFn } from "src/utils/fetchAsync"

export const usersQueryKey = ["users"]
export function userUsersQuery() {
    return useQuery<User[]>({
        queryKey: usersQueryKey,
        queryFn: fetchFn<User[]>("/api/users"),
    })
}

export const deactivatedUsersQueryKey = [ ...usersQueryKey, "deactivated"]
export function useDeactivatedUsersQuery() { 
    const {isSuperAdmin} = usePotentialUser()
    return useQuery<DeactivatedUser[]>({ 
        queryKey: deactivatedUsersQueryKey,
        queryFn: fetchFn<DeactivatedUser[]>("/api/users/deactivated"),
        enabled: isSuperAdmin
    })
}

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
        queryKey: usersQueryKey,
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