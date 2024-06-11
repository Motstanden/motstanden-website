import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from 'src/hooks/useStorage';

type LoggedOutContextType = { 
    user: undefined,
    isPending: boolean,
    isLoggedIn: false,
    isEditor: false,
    isAdmin: false,
    isSuperAdmin: false,
    signOut: undefined,
    signOutAllDevices: undefined
}

type LoggedInContextType = { 
    user: User,
    isPending: boolean,
    isLoggedIn: true,
    isEditor: boolean,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    signOut: () => Promise<void>
    signOutAllDevices: () => Promise<void>
}

type AuthContextType =  LoggedInContextType | LoggedOutContextType

export const potentialUserContext = React.createContext<AuthContextType>(null!);
export const authenticatedUserContext = React.createContext<LoggedInContextType>(null!);

/**
 * Use this hook when you need to get user data in contexts where you don't know if the user is logged in or not.
 * @returns The current user or undefined if the user is not logged in.
 */
export function usePotentialUser(): AuthContextType {
    return useContext(potentialUserContext)
}

/**
 * Use this hook when you need to get user data in contexts where you know for a fact that the user is logged in.
 * If the user is not logged in, this break the app.
 * @returns The current user.
 */
export function useAuthenticatedUser(): LoggedInContextType {
    return useContext(authenticatedUserContext)
}

function signOutCurrentUser( {onSuccess}: { onSuccess?: () => void | Promise<void> } ) { 
    return async () => { 
        const response = await fetch("/api/auth/logout", { method: "POST" })
        if(response.ok) {
            await onSuccess?.()
        }
    }
}

function signOutAllDevices( {onSuccess}: { onSuccess?: () => void | Promise<void> } ) { 
    return async () => { 
        const response = await fetch("/api/auth/logout/all-devices", { method: "POST" })
        if(response.ok) {
            await onSuccess?.()
        }
    }
}

async function fetchCurrentUser(): Promise<User | null> {
    const res = await fetch("/api/auth/current-user")
    if(!res.ok)
        throw `${res.status} ${res.statusText}`

    if (res.status === 204)     // Request was successful but user is not logged in
        return null
    
    return await res.json()
}

// NB: If you change this, make sure to also change the key in the global playwright test setup file:
//     tests/global.setup.ts
export const userQueryKey = ["user", "current"]

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [previousUser, setPreviousUser ] = useLocalStorage<User | null>({
        key: userQueryKey,
        initialValue: null,
    })

    const { isPending, data: user, dataUpdatedAt, isPlaceholderData } = useQuery<User | null>({
        queryKey: userQueryKey,
        queryFn: fetchCurrentUser,
        placeholderData: previousUser,
    })

    useEffect(() => { 
        if(!isPlaceholderData) {
            setPreviousUser(user ?? null)
        } 
    }, [dataUpdatedAt, user, isPlaceholderData])

    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const onSignOutSuccess = async () => { 
        navigate("/framside")
        setPreviousUser(null)
        await queryClient.invalidateQueries({ queryKey: userQueryKey })
    }

    let contextValue: AuthContextType
    if(user) {
        contextValue = {
            user: user,
            isPending: isPending,
            isLoggedIn: true as const,
            isEditor: hasGroupAccess(user, UserGroup.Editor),
            isAdmin: hasGroupAccess(user, UserGroup.Administrator),
            isSuperAdmin: hasGroupAccess(user, UserGroup.SuperAdministrator),
            signOut: signOutCurrentUser({ 
                onSuccess: onSignOutSuccess 
            }),
            signOutAllDevices: signOutAllDevices({ 
                onSuccess: onSignOutSuccess 
            })
        } as const
    } else {
        contextValue = {
            user: undefined,
            isPending: isPending,
            isLoggedIn: false as const,
            isEditor: false as const,
            isAdmin: false as const,
            isSuperAdmin: false as const,
            signOut: undefined,
            signOutAllDevices: undefined
        } as const
    }

    return (
        <potentialUserContext.Provider value={contextValue}>
            <AuthenticatedUserProvider>
                {children}
            </AuthenticatedUserProvider>
        </potentialUserContext.Provider>
    )
}

function AuthenticatedUserProvider({ children }: { children: React.ReactNode }) {
    const auth = usePotentialUser();

    // useAuthenticatedUser hook should only be used when we know for a fact that the user is logged in.
    // Prefer the app to break if a developer mistakenly calls this hook in a context where they don't know for sure that the user is logged in.
    if(!auth.isLoggedIn)
        return children
    
    return (
        <authenticatedUserContext.Provider value={auth}>
            {children}
        </authenticatedUserContext.Provider>
    )

}

export function RequireAuth({ requiredGroup, children }: { children: React.ReactNode, requiredGroup?: UserGroup }) {
    const auth = usePotentialUser();
    const {isLoggedIn, user} = auth;

    const [ initialLocation ] = useState(useLocation())

    if(!isLoggedIn) {
        console.log("Navigating to /logg-inn")
        return <Navigate to="/logg-inn" state={{ from: initialLocation }} replace />;
    }

    if(requiredGroup && !hasGroupAccess(user, requiredGroup)) {
        return <Navigate to="/" replace />;
    }

    return children
}

export function RequireAuthRouter({ requiredGroup }: { requiredGroup?: UserGroup }) {
    return <RequireAuth requiredGroup={requiredGroup}><Outlet /></RequireAuth>
}