import { useQuery } from '@tanstack/react-query';
import { PublicCookieName, UserGroup } from "common/enums";
import { UnsafeUserCookie, User } from "common/interfaces";
import { hasGroupAccess, isNullOrWhitespace } from "common/utils";
import dayjs from 'dayjs';
import React, { useContext, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

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

async function signOutCurrentUser(): Promise<void> {
    const response = await fetch("/api/auth/logout", { method: "POST" })
    if(response.ok) {
        window.location.href = `${window.location.origin}` // Do a full page refresh
    }
}

async function signOutAllDevices(): Promise<void> {
    const response = await fetch("/api/auth/logout/all-devices", { method: "POST" })
    if(response.ok) {
        window.location.href = `${window.location.origin}` // Do a full page refresh
    }
}

// Gets the user from the previous session if it exists.
// Nb: Never trust the user object from this cookie, it can be tampered with.
function getPreviousUser(): User | undefined {
    const cookieValue = document.cookie
        .split(";")
        .find((item) => item.trim().startsWith(`${PublicCookieName.UnsafeUserInfo}=`))
        ?.split("=")[1]
    
    if(!cookieValue || isNullOrWhitespace(cookieValue))
        return undefined

    let user: UnsafeUserCookie
    try {
        user = JSON.parse(cookieValue)
    } catch {
        return undefined
    }

    const expiryTime = dayjs.utc(user.expires)

    if(!expiryTime.isValid())
        return undefined

    const currentTime = dayjs()
    if(currentTime.isAfter(expiryTime))
        return undefined

    return user
}

async function fetchCurrentUser(): Promise<User | null> {
    const res = await fetch("/api/auth/current-user")
    if(!res.ok)
        throw `${res.status} ${res.statusText}`

    if (res.status === 204)     // Request was successful but user is not logged in
        return null
    
    return await res.json()
}

export const userQueryKey = ["GetCurrentUser"]

/**
 * Provider for usePotentialUser hook.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [ previousUser ] = useState<User | undefined>(getPreviousUser())

    const { isPending, data } = useQuery<User | null>({
        queryKey: userQueryKey,
        queryFn: fetchCurrentUser
    })

    const user = isPending 
        ? previousUser 
        : data ?? undefined
    let contextValue: AuthContextType
    if(user) {
        contextValue = {
            user: user,
            isPending: isPending,
            isLoggedIn: true as const,
            isEditor: hasGroupAccess(user, UserGroup.Editor),
            isAdmin: hasGroupAccess(user, UserGroup.Administrator),
            isSuperAdmin: hasGroupAccess(user, UserGroup.SuperAdministrator),
            signOut: signOutCurrentUser,
            signOutAllDevices: signOutAllDevices
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

    if(contextValue.isLoggedIn) {
        return (
            <potentialUserContext.Provider value={contextValue}>
                <authenticatedUserContext.Provider value={contextValue}>
                    {children}
                </authenticatedUserContext.Provider>
            </potentialUserContext.Provider>
        )
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

    // This hook should only be used when we know for a fact that the user is logged in.
    // Prefer the app to break if a developer mistakenly calls this hook in a context where they don't know for sure that the user is logged in.
    if(!auth.isLoggedIn)
        return children
    
    return (
        <authenticatedUserContext.Provider value={auth}>
            {children}
        </authenticatedUserContext.Provider>
    )

}

/**
 * Provider for useAuthenticatedUser hook.
 */
export function RequireAuth({ requiredGroup, children }: { children: React.ReactNode, requiredGroup?: UserGroup }) {
    const auth = usePotentialUser();
    const {isLoggedIn, user} = auth;

    const [ initialLocation ] = useState(useLocation())

    if(!isLoggedIn) {
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