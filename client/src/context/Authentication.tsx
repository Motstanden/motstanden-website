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

export const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth(): AuthContextType {
    return useContext(AuthContext)
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

    const expiryTime = dayjs(user.expires)

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

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function RequireAuth({ requiredGroup, children }: { children: React.ReactNode, requiredGroup?: UserGroup }) {
    const { user, isLoggedIn } = useAuth();
    
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