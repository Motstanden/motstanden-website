import { useQuery } from "@tanstack/react-query"
import { DeactivatedUser, User } from "common/interfaces"
import { usePotentialUser } from "src/context/Authentication"
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