import { useQuery } from "@tanstack/react-query";
import { UserReference } from "common/interfaces";
import React, { useEffect } from "react";
import { fetchAsync } from "src/utils/fetchAsync";
import { useAuth } from "./Authentication";

export interface UserReferenceContextType {
    isLoading: boolean,
    isError: boolean,
    isEnabled: boolean,
    userReference: Record<number, UserReference>
}

const emptyUserReference: UserReferenceContextType = {
    isLoading: false,
    isError: false,
    isEnabled: false,
    userReference: {}
}

const UserReferenceContext = React.createContext<UserReferenceContextType>(emptyUserReference);

export function useUserReference() {
    return React.useContext(UserReferenceContext)
}

export function UserReferenceProvider( {children}: {children: React.ReactNode} ) {
 
    const user = useAuth().user
    const isEnabled = !!user        // The context is enabled if the user is logged in

    let initialValue: UserReferenceContextType = emptyUserReference
    if(!isEnabled) {
        initialValue.isError = false
        initialValue.isLoading = false
    }
    initialValue.isEnabled = isEnabled

    const [userReference, setUserReference] = React.useState<UserReferenceContextType>(initialValue)

    const { isLoading, isError, data, error } = useQuery<UserReference[]>(["user-reference"], () => 
        fetchAsync<UserReference[]>("/api/simplified-member-list"), 
        {
            enabled: isEnabled
        })

    useEffect(() => {

        const userLookUpTable: Record<number, UserReference> = {}
        if(data) {
            for(let userRef of data) {
                userLookUpTable[userRef.id] = userRef
            }
        }

        setUserReference({
            isLoading: isLoading,
            isError: isError,
            userReference: userLookUpTable,
            isEnabled: isEnabled
        })

    }, [data, isLoading, isError])

    return (
        <UserReferenceContext.Provider value={userReference}>
            {children}
        </UserReferenceContext.Provider>
    )
}