import { useQuery } from "@tanstack/react-query"
import { UserIdentity } from "common/interfaces"
import React, { useEffect } from "react"
import { fetchFn } from "src/utils/fetchAsync"
import { usePotentialUser } from "./Authentication"

export interface UserReferenceContextType {
    isPending: boolean,
    isError: boolean,
    isEnabled: boolean,
    userReference: Record<number, UserIdentity>
}

const emptyUserReference: UserReferenceContextType = {
    isPending: false,
    isError: false,
    isEnabled: false,
    userReference: {}
}

const UserReferenceContext = React.createContext<UserReferenceContextType>(emptyUserReference);

export function useUserReference() {
    return React.useContext(UserReferenceContext)
}

export function UserReferenceProvider( {children}: {children: React.ReactNode} ) {
 
    const { isLoggedIn } = usePotentialUser()

    const initialValue: UserReferenceContextType = emptyUserReference
    if(!isLoggedIn) {
        initialValue.isError = false
        initialValue.isPending = false
    }
    initialValue.isEnabled = isLoggedIn

    const [userReference, setUserReference] = React.useState<UserReferenceContextType>(initialValue)

    const { isPending, isError, data } = useQuery<UserIdentity[]>({
        queryKey: ["user-reference"],
        queryFn: fetchFn<UserIdentity[]>("/api/users/identifiers"),
        enabled: isLoggedIn
    })

    useEffect(() => {

        const userLookUpTable: Record<number, UserIdentity> = {}
        if(data) {
            for(const userRef of data) {
                userLookUpTable[userRef.id] = userRef
            }
        }

        setUserReference({
            isPending: isPending,
            isError: isError,
            userReference: userLookUpTable,
            isEnabled: isLoggedIn
        })

    }, [data, isPending, isError])

    return (
        <UserReferenceContext.Provider value={userReference}>
            {children}
        </UserReferenceContext.Provider>
    )
}