import { useQuery } from "@tanstack/react-query"
import { DeactivatedUser, User } from "common/interfaces"
import { usePotentialUser } from "src/context/Authentication"
import { fetchFn } from "src/utils/fetchAsync"

export const usersQueryKey = ["users", "all"]
export function userUsersQuery() {
    return useQuery<User[]>({
        queryKey: usersQueryKey,
        queryFn: fetchFn<User[]>("/api/users"),
    })
}

export const deactivatedUsersQueryKey = [ "users", "deactivated"]
export function useDeactivatedUsersQuery() { 
    const {isSuperAdmin} = usePotentialUser()
    const query = useQuery<DeactivatedUser[]>({ 
        queryKey: deactivatedUsersQueryKey,
        queryFn: fetchFn<DeactivatedUser[]>("/api/users/deactivated"),
        enabled: isSuperAdmin
    })
    return {
        ...query,
        isPending: query.isPending && isSuperAdmin,
    }
}