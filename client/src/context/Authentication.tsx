import { useQuery } from '@tanstack/react-query';
import { PublicCookieName, UserGroup } from "common/enums";
import { UnsafeUserCookie, User } from "common/interfaces";
import { hasGroupAccess, isNullOrWhitespace } from "common/utils";
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchAsync } from 'src/utils/fetchAsync';

type AuthContextType =  {
    user: User | undefined,
    isLoading: boolean,
    signOut: () => Promise<void>
    signOutAllDevices: () => Promise<void>
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
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

export const userQueryKey = ["GetUserMetaData"]

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [ previousUser ] = useState<User | undefined>(getPreviousUser())

    const { isLoading, data } = useQuery<User | null>(userQueryKey, fetchCurrentUser)

    const contextValue: AuthContextType = {
        user: isLoading ? previousUser : data ?? undefined,
        isLoading: isLoading,
        signOut: signOutCurrentUser,
        signOutAllDevices: signOutAllDevices
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function RequireAuth({ requiredGroup, children }: { children: JSX.Element, requiredGroup?: UserGroup }) {
    const { user } = useAuth();
    
    const [ initialLocation ] = useState(useLocation())

    const isLoggedIn = () => !!user

    const isInvalidGroup = () => user && requiredGroup && !hasGroupAccess(user, requiredGroup)

    if(!isLoggedIn()) {
        return <Navigate to="/logg-inn" state={{ from: initialLocation }} replace />;
    }

    if(isInvalidGroup()) {
        return <Navigate to="/" replace />;
    }

    return children
}

export function RequireAuthRouter({ requiredGroup }: { requiredGroup?: UserGroup }) {
    return <RequireAuth requiredGroup={requiredGroup}><Outlet /></RequireAuth>
}