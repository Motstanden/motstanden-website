import { useQuery } from "@tanstack/react-query";
import { UserReference } from "common/interfaces";
import React, { useEffect } from "react";
import { fetchFn } from "src/utils/fetchAsync";
import { usePotentialUser } from "./Authentication";

export interface UserReferenceContextType {
    isPending: boolean,
    isError: boolean,
    isEnabled: boolean,
    userReference: Record<number, UserReference>
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

    let initialValue: UserReferenceContextType = emptyUserReference
    if(!isLoggedIn) {
        initialValue.isError = false
        initialValue.isPending = false
    }
    initialValue.isEnabled = isLoggedIn

    const [userReference, setUserReference] = React.useState<UserReferenceContextType>(initialValue)

    const { isPending, isError, data, error } = useQuery<UserReference[]>({
        queryKey: ["user-reference"],
        queryFn: fetchFn<UserReference[]>("/api/simplified-member-list"),
        enabled: isLoggedIn
    })

    useEffect(() => {

        const userLookUpTable: Record<number, UserReference> = {}
        if(data) {
            for(let userRef of data) {
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