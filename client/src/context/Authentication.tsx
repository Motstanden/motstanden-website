import { useQuery } from '@tanstack/react-query';
import { PublicCookieName, UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { fetchAsync } from 'src/utils/fetchAsync';

enum LoginStatus {
    LoggedIn,
    LoggedOut,
    PossiblyLoggedIn
}

type LoggedInContextType = {
    loginStatus: LoginStatus.LoggedIn,
    isProbablyLoggedIn: true,
    user: User,
    signOut: () => Promise<void>;
    signOutAllDevices: () => Promise<void>;
}

type LoggedOutContextType = {
    loginStatus: LoginStatus.LoggedOut,
    isProbablyLoggedIn: false,
    user: undefined,
}

type PossiblyLoggedInContextType = {
    isProbablyLoggedIn: true,
    user: undefined,
    loginStatus: LoginStatus.PossiblyLoggedIn,
}

type AuthContextType = LoggedInContextType | LoggedOutContextType | PossiblyLoggedInContextType


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

// Returns false if there is absolutely no way the user is logged in. 
// Returns true if the user might be logged in. (We have no way to know for sure without asking the server)
function isProbablyLoggedIn(): boolean {
    const refreshTokenExpiry = document.cookie
        .split(";")
        .find((item) => item.trim().startsWith(`${PublicCookieName.RefreshTokenExpiry}=`))
        ?.split("=")[1]
    
    if(!refreshTokenExpiry)
        return false

    const expiryTime = dayjs(refreshTokenExpiry)

    if(!expiryTime.isValid())
        return false

    const currentTime = dayjs()

    return currentTime.isBefore(expiryTime)
}

export const userQueryKey = ["GetUserMetaData"]

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const isOptimisticAuth = isProbablyLoggedIn()
    const { isLoading, data, isError } = useQuery<User>(userQueryKey, () => fetchAsync<User>("/api/auth/current-user"), {
        enabled: isOptimisticAuth
    })

    let loginStatus: LoginStatus

    if(isOptimisticAuth && (isLoading || isError)) {
        loginStatus = LoginStatus.PossiblyLoggedIn
    } else if(!isLoading && !isError && !!data) {
        loginStatus = LoginStatus.LoggedIn
    } else {
        loginStatus = LoginStatus.LoggedOut
    }

    let contextValue: AuthContextType

    switch(loginStatus) {
        case LoginStatus.LoggedIn: {
            contextValue = { 
                loginStatus: LoginStatus.LoggedIn,
                isProbablyLoggedIn: true,
                user: data!,
                signOut: signOutCurrentUser,
                signOutAllDevices: signOutAllDevices
            }
            break;
        }
        case LoginStatus.PossiblyLoggedIn: {
            contextValue = {
                loginStatus: LoginStatus.PossiblyLoggedIn,
                isProbablyLoggedIn: true,
                user: undefined,
            }
            break;
        }
        case LoginStatus.LoggedOut: {
            contextValue = {
                loginStatus: LoginStatus.LoggedOut,
                isProbablyLoggedIn: false,
                user: undefined,
            }
            break;
        }
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function RequireAuth({ requiredGroup, children }: { children: JSX.Element, requiredGroup?: UserGroup }) {
    const { loginStatus, user } = useAuth();
    
    const location = useLocation()
    const [initialLocation ] = useState(location)

    if(loginStatus === LoginStatus.LoggedOut) {
        return <Navigate to="/logg-inn" state={{ from: initialLocation }} replace />;
    }

    if(loginStatus === LoginStatus.LoggedIn && requiredGroup && !hasGroupAccess(user, requiredGroup)) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children
}

export function RequireAuthRouter({ requiredGroup }: { requiredGroup?: UserGroup }) {
    return <RequireAuth requiredGroup={requiredGroup}><Outlet /></RequireAuth>
}