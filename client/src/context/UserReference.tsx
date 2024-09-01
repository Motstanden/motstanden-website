import { useQuery } from "@tanstack/react-query"
import { UserIdentity } from "common/interfaces"
import React, { useMemo } from "react"
import { fetchFn } from "src/utils/fetchAsync"
import { usePotentialUser } from "./Authentication"

interface DeletedUser extends Omit<UserIdentity, "id"> { 
    id: undefined,
    isDeleted: true
}

interface ActiveUser extends Omit<UserIdentity, "id"> { 
    id: number
    isDeleted: false
}

type UserIdentityExtended = ActiveUser | DeletedUser

export type UserReferenceContextType = {
    isPending: false,
    isError: false,
    isEnabled: true
    getUser: (userId: number) => UserIdentityExtended
} | {
    isPending: true,
    isError: false,
    isEnabled: true
    getUser: undefined
} | {
    isPending: false,
    isError: true,
    isEnabled: true
    getUser: undefined
} | {
    isPending: false,
    isError: false,
    isEnabled: false
    getUser: undefined
}

const UserReferenceContext = React.createContext<UserReferenceContextType>(null!);

/**
 * Gets a references of all users.
 * Use this hook in contexts where you don't know if the current user is authenticated.
 */
export function usePotentialUserReference(): UserReferenceContextType {
    return React.useContext(UserReferenceContext)
}

/**
 * Gets a references of all users.
 * Only use this hook in contexts where you know for a fact that the current user is authenticated.
 */
export function useUserReference() {

    const context = React.useContext(UserReferenceContext)

    // This hook was called in a context where the user is not authenticated.
    // Prefer the app to break to quickly notify the developer of the mistake.
    if(context.isEnabled === false)
        throw new Error("useUserReference can only be used in contexts where the current user is authenticated.")

    return context
}

export const userReferenceQueryKey = ["user-reference"]

export function UserReferenceProvider( {children}: {children: React.ReactNode} ) {
 
    const { isLoggedIn: isEnabled } = usePotentialUser()

    const { isPending, isError, data } = useQuery<UserIdentity[]>({
        queryKey: userReferenceQueryKey,
        queryFn: fetchFn<UserIdentity[]>("/api/users/identifiers"),
        enabled: isEnabled
    })

    const userLookUpTable: Record<number, UserIdentity> = useMemo(() => {
        const lookUpTable: Record<number, UserIdentity> = {}
        if(data) {
            for(const userRef of data) {
                lookUpTable[userRef.id] = userRef
            }
        }
        return lookUpTable
    }, [data])
    
    const getUser = (userId: number): UserIdentityExtended => { 
        const user = userLookUpTable[userId]
        if(user) {
            return { ...user, isDeleted: false }
        } else {
            return { 
                id: undefined,
                fullName: "[Slettet]",
                shortFullName: "[Slettet]",
                initials: "SL",
                isDeleted: true
            }
        }
    }

    let contextValue: UserReferenceContextType 
    if(isEnabled === false) {
        contextValue = { 
            isPending: false,
            isError: false,
            isEnabled: false,
            getUser: undefined
        }
    } else if(isPending) {
        contextValue = { 
            isPending: true,
            isError: false,
            isEnabled: true,
            getUser: undefined
        }
    } else if(isError) {
        contextValue = { 
            isPending: false,
            isError: true,
            isEnabled: true,
            getUser: undefined
        }
    } else {
        contextValue = { 
            isPending: false,
            isError: false,
            isEnabled: true,
            getUser
        }
    }

    return (
        <UserReferenceContext.Provider value={contextValue}>
            {children}
        </UserReferenceContext.Provider>
    )
}