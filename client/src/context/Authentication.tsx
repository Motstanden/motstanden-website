import { useQuery } from '@tanstack/react-query';
import { UserGroup } from "common/enums";
import { User } from "common/interfaces";
import { hasGroupAccess } from "common/utils";
import React, { useContext, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface AuthContextType {
    user: User | null
    signOut: () => Promise<boolean>;
    signOutAllUnits: () => Promise<boolean>;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null)

    const signOutRequest = async (url: string): Promise<boolean> => {
        const response = await fetch(url, { method: "POST" })
        if (!response.ok) {
            return false
        }
        setUser(null)
        return true;
    }

    // Define logout logic
    const signOut = async (): Promise<boolean> => await signOutRequest("/api/logout")
    const signOutAllUnits = async (): Promise<boolean> => await signOutRequest("/api/logout-all-units")

    const fetchUserData = async (): Promise<User | null> => {
        const res = await fetch("/api/userMetaData")
        if (!res.ok) {
            throw new Error(res.statusText)
        }

        if (res.status === 204) {   // Request was successful but user is not logged in. 
            setUser(null)
            return null
        }

        const userData = await res.json() as User;
        setUser(userData)
        return userData
    }

    const { isLoading } = useQuery<User | null>(["GetUserMetaData"], () => fetchUserData())

    if (isLoading) {
        return <></>
    }

    const contextValue = { user, signOut, signOutAllUnits }
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function RequireAuth({ requiredGroup, children }: { children: JSX.Element, requiredGroup?: UserGroup }) {
    const auth = useAuth();
    const location = useLocation()

    if (!auth.user) {
        // Redirect them to the /logg-inn page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/logg-inn" state={{ from: location }} replace />;
    }

    if (requiredGroup && !hasGroupAccess(auth.user, requiredGroup)) {
        return <Navigate to="/hjem" state={{ from: location }} replace />;
    }

    return children
}

export function RequireAuthRouter({ requiredGroup }: { requiredGroup?: UserGroup }) {
    return <RequireAuth requiredGroup={requiredGroup}><Outlet /></RequireAuth>
}